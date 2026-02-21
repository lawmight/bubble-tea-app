import { unstable_cache } from 'next/cache';

import { ProductModel } from '@vetea/shared/models/Product';
import { OrderModel } from '@vetea/shared/models/Order';
import type { Product, Order } from '@vetea/shared';

import { connectDB } from '@/lib/db';

function normalizeProduct(raw: Record<string, unknown>): Product {
  return {
    id: String(raw._id),
    name: String(raw.name),
    slug: String(raw.slug),
    description: String(raw.description),
    basePriceInCents: Number(raw.basePriceInCents),
    category: raw.category as Product['category'],
    image: String(raw.image),
    available: Boolean(raw.available),
    customizations: (raw.customizations as Product['customizations']) ?? [],
    createdAt: new Date(String(raw.createdAt)),
    updatedAt: new Date(String(raw.updatedAt)),
  };
}

function normalizeOrder(raw: Record<string, unknown>): Order {
  return {
    id: String(raw._id),
    orderNumber: String(raw.orderNumber),
    idempotencyKey: String(raw.idempotencyKey),
    userId: String(raw.userId),
    items: (raw.items as Order['items']) ?? [],
    subtotalInCents: Number(raw.subtotalInCents),
    taxInCents: Number(raw.taxInCents),
    taxRate: Number(raw.taxRate),
    tipInCents: Number(raw.tipInCents),
    serviceFeeInCents: Number(raw.serviceFeeInCents),
    totalPriceInCents: Number(raw.totalPriceInCents),
    estimatedReadyAt: raw.estimatedReadyAt ? new Date(String(raw.estimatedReadyAt)) : undefined,
    status: raw.status as Order['status'],
    createdAt: new Date(String(raw.createdAt)),
    updatedAt: new Date(String(raw.updatedAt)),
  };
}

const getAllProductsCached = unstable_cache(
  async () => {
    await connectDB();
    const products = await ProductModel.find({})
      .sort({ category: 1, name: 1 })
      .lean()
      .exec();
    return products.map((p) => normalizeProduct(p as Record<string, unknown>));
  },
  ['admin-all-products'],
  { revalidate: 60, tags: ['products'] },
);

const getProductByIdCached = unstable_cache(
  async (id: string) => {
    await connectDB();
    const product = await ProductModel.findById(id).lean().exec();
    return product ? normalizeProduct(product as Record<string, unknown>) : null;
  },
  ['admin-product-by-id'],
  { revalidate: 60, tags: ['products'] },
);

const getAllOrdersCached = unstable_cache(
  async () => {
    await connectDB();
    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()
      .exec();
    return orders.map((o) => normalizeOrder(o as Record<string, unknown>));
  },
  ['admin-all-orders'],
  { revalidate: 15, tags: ['orders'] },
);

export async function getAllProducts(): Promise<Product[]> {
  return getAllProductsCached();
}

export async function getProductById(id: string): Promise<Product | null> {
  return getProductByIdCached(id);
}

export async function getAllOrders(): Promise<Order[]> {
  return getAllOrdersCached();
}
