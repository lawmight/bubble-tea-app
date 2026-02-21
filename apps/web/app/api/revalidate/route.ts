import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { env } from '@/lib/env';

const ALLOWED_TAGS = ['products', 'orders'] as const;

/**
 * On-demand revalidation. Call after seeding or when you need to clear cache.
 * Requires REVALIDATE_SECRET in env.
 *
 * Example (after seeding production DB):
 *   curl "https://vtbbt.vercel.app/api/revalidate?secret=YOUR_SECRET&tag=products"
 */
export async function GET(request: Request): Promise<NextResponse> {
  const secret = env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, message: 'Revalidate not configured (REVALIDATE_SECRET missing).' },
      { status: 501 },
    );
  }

  const { searchParams } = new URL(request.url);
  const providedSecret = searchParams.get('secret');
  const tag = searchParams.get('tag');

  if (providedSecret !== secret) {
    return NextResponse.json({ revalidated: false, message: 'Invalid secret.' }, { status: 401 });
  }

  if (!tag || !ALLOWED_TAGS.includes(tag as (typeof ALLOWED_TAGS)[number])) {
    return NextResponse.json(
      { revalidated: false, message: `Invalid or missing tag. Allowed: ${ALLOWED_TAGS.join(', ')}` },
      { status: 400 },
    );
  }

  revalidateTag(tag);
  return NextResponse.json({ revalidated: true, tag });
}
