import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getUserOrders } from '@/lib/queries/orders';

export async function GET(): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 },
      );
    }

    const orders = await getUserOrders(userId);
    return NextResponse.json(
      { success: true, message: 'Orders fetched.', data: orders },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders.' },
      { status: 500 },
    );
  }
}
