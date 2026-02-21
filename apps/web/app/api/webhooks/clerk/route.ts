import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

import { UserModel } from '@vetea/shared/models/User';
import { WebhookEventModel } from '@vetea/shared/models/WebhookEvent';
import type { WebhookEvent } from '@clerk/nextjs/server';

import { connectDB } from '@/lib/db';
import { env } from '@/lib/env';
import { log } from '@/lib/logger';

export async function POST(request: Request): Promise<NextResponse> {
  const headerPayload = await headers();
  const svixId = headerPayload.get('svix-id');
  const svixTimestamp = headerPayload.get('svix-timestamp');
  const svixSignature = headerPayload.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { success: false, message: 'Missing signature headers.' },
      { status: 400 },
    );
  }

  const payload = await request.text();
  const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let event: WebhookEvent;
  try {
    event = webhook.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    log('warn', 'Invalid Clerk webhook signature', { error });
    return NextResponse.json(
      { success: false, message: 'Invalid signature.' },
      { status: 400 },
    );
  }

  await connectDB();

  const existing = await WebhookEventModel.findOne({ eventId: svixId }).lean().exec();
  if (existing) {
    return NextResponse.json({ success: true, message: 'Duplicate ignored.' }, { status: 200 });
  }

  try {
    switch (event.type) {
      case 'user.created':
      case 'user.updated': {
        await UserModel.findOneAndUpdate(
          { clerkId: event.data.id },
          {
            clerkId: event.data.id,
            email: event.data.email_addresses[0]?.email_address ?? '',
            name: [event.data.first_name, event.data.last_name].filter(Boolean).join(' ').trim(),
            phone: event.data.phone_numbers[0]?.phone_number ?? undefined,
            deletedAt: undefined,
          },
          { upsert: true, new: true },
        ).exec();
        break;
      }
      case 'user.deleted': {
        if (event.data.id) {
          await UserModel.findOneAndUpdate(
            { clerkId: event.data.id },
            { deletedAt: new Date() },
          ).exec();
        }
        break;
      }
      default: {
        log('info', 'Unhandled Clerk webhook event', { type: event.type });
      }
    }

    await WebhookEventModel.create({
      eventId: svixId,
      eventType: event.type,
      processedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: 'Webhook processed.' },
      { status: 200 },
    );
  } catch (error) {
    log('error', 'Failed processing Clerk webhook', { error, type: event.type });
    return NextResponse.json(
      { success: false, message: 'Webhook processing failed.' },
      { status: 500 },
    );
  }
}
