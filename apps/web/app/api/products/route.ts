import { NextResponse } from 'next/server';

import { getProducts } from '@/lib/queries/products';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') ?? undefined;
    const products = await getProducts(category);

    return NextResponse.json(
      { success: true, message: 'Products fetched.', data: products },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products.' },
      { status: 500 },
    );
  }
}
