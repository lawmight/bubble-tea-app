import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const defaultAppUrl = 'https://vtbbt.vercel.app';

function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) return defaultAppUrl;
  try {
    new URL(raw);
    return raw;
  } catch {
    return defaultAppUrl;
  }
}

export const env = createEnv({
  server: {
    MONGODB_URI: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1, 'Resend API key required for emails').optional(),
    STAFF_EMAIL: z.string().email().optional(),
    /** Optional. When set, GET /api/revalidate?secret=...&tag=products is allowed for on-demand cache revalidation (e.g. after seeding). */
    REVALIDATE_SECRET: z.string().min(1).optional(),
  },
  client: {
    /** Required for auth/links; defaults to production URL so Vercel build succeeds before env is set. */
    NEXT_PUBLIC_APP_URL: z.string().url().default('https://vtbbt.vercel.app'),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().min(1),
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  runtimeEnv: {
    MONGODB_URI: process.env.MONGODB_URI,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    STAFF_EMAIL: process.env.STAFF_EMAIL,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
    NEXT_PUBLIC_APP_URL: getAppUrl(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  },
  emptyStringAsUndefined: true,
});
