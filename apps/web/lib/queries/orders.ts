import { unstable_cache } from 'next/cache';

import { OrderModel, type Order } from '@vetea/shared';

import { connectDB } from '@/lib/db';

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

const getUserOrdersCached = unstable_cache(
  async (userId: string) => {
    await connectDB();
    const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }).limit(50).lean().exec();
    return orders.map((order) => normalizeOrder(order as Record<string, unknown>));
  },
  ['orders-by-user'],
  { revalidate: 30, tags: ['orders'] },
);

export async function getUserOrders(userId: string): Promise<Order[]> {
  return getUserOrdersCached(userId);
}

export async function getOrderByIdempotencyKey(
  idempotencyKey: string,
): Promise<Order | null> {
  await connectDB();
  const order = await OrderModel.findOne({ idempotencyKey }).lean().exec();
  return order ? normalizeOrder(order as Record<string, unknown>) : null;
}

export async function getQueueLength(): Promise<number> {
  await connectDB();
  return OrderModel.countDocuments({ status: { $in: ['pending', 'preparing'] } });
}
