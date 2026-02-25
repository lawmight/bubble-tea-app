import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe';

const checkoutRequestSchema = z.object({
  orderNumber: z.string().min(1),
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().int().positive(),
      unitPriceInCents: z.number().int().nonnegative(),
    }),
  ),
  taxInCents: z.number().int().nonnegative(),
  tipInCents: z.number().int().nonnegative(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Online payment is not configured.' },
      { status: 501 },
    );
  }

  const body: unknown = await request.json();
  const parsed = checkoutRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const url = await createCheckoutSession(parsed.data);

  if (!url) {
    return NextResponse.json(
      { error: 'Unable to create checkout session.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ url });
}
