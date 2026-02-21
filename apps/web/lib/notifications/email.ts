import { Resend } from 'resend';

export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set');
  }
  return new Resend(apiKey);
}

export async function sendTestEmail() {
  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: 'VETEA <onboarding@resend.dev>',
    to: 'veteacoustols@gmail.com',
    subject: 'Hello from VETEA',
    html: '<p>Congrats on sending your <strong>first email</strong> with Resend!</p>',
  });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
