import type { Metadata } from 'next';

import { auth } from '@clerk/nextjs/server';
import { formatMoney, STORE_TIMEZONE, toMoney } from '@vetea/shared';

import { CancelOrderButton } from '@/components/shop/CancelOrderButton';
import { getUserOrders } from '@/lib/queries/orders';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Track your VETEA order history.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrdersPage(): Promise<JSX.Element> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const orders = await getUserOrders(userId);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-[#2a2a2a]">My orders</h1>
      {orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#d8c7b0] bg-white p-6 text-sm text-[#6f5a44]">
          No orders yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="space-y-3 rounded-2xl border border-[#e6dac9] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[#2a2a2a]">{order.orderNumber}</p>
                  <p className="text-xs text-[#6f5a44]">
                    {new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: STORE_TIMEZONE,
                    }).format(order.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-[#f3ede3] px-2.5 py-1 text-xs font-semibold capitalize text-[#5b4632]">
                  {order.status}
                </span>
              </div>
              <ul className="space-y-1 text-sm text-[#5b4632]">
                {order.items.map((item) => (
                  <li key={`${order.id}:${item.productId}:${item.name}`}>
                    {item.quantity}x {item.name} ({item.size})
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#245741]">
                  {formatMoney(toMoney(order.totalPriceInCents))}
                </p>
                {order.status === 'pending' ? <CancelOrderButton orderId={order.id} /> : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
