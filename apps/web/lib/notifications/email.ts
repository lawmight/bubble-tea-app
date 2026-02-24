import { Resend } from 'resend';

import { env } from '@/lib/env';

const DEFAULT_FROM = 'VETEA <onboarding@resend.dev>';

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(apiKey);
}

/** From address for outgoing emails; use EMAIL_FROM when domain is verified in Resend. */
export function getEmailFrom(): string {
  return env.EMAIL_FROM ?? DEFAULT_FROM;
}

export async function sendTestEmail() {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: getEmailFrom(),
    to: 'veteacoustols@gmail.com',
    subject: 'Hello from VETEA',
    html: '<p>Congrats on sending your <strong>first email</strong> with Resend!</p>',
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
