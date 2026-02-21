import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';

import { sendTestEmail } from '@/lib/notifications/email';

/**
 * Test endpoint for Resend integration.
 * Only available in development or for admin users.
 */
export async function POST() {
  const isDev = process.env.NODE_ENV === 'development';
  const { sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const isAdmin = metadata?.role === 'admin';

  if (!isDev && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY is not configured' },
      { status: 503 },
    );
  }

  try {
    const data = await sendTestEmail();
    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
