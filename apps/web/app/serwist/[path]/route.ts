import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      success: false,
      message:
        'Serwist route scaffold created. Wire @serwist/next build integration before production.',
    },
    { status: 501 },
  );
}
