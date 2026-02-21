import type { Metadata } from 'next';
import Link from 'next/link';

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

const STATUS_COLORS: Record<string, string> = {
  completed: '#8B9F82',
  ready: '#8B9F82',
  preparing: '#C4A35A',
  pending: '#8C7B6B',
  cancelled: '#A0524F',
};

const STATUS_BG: Record<string, string> = {
  completed: 'bg-[#8B9F82]/10',
  ready: 'bg-[#8B9F82]/10',
  preparing: 'bg-[#C4A35A]/10',
  pending: 'bg-[#8C7B6B]/10',
  cancelled: 'bg-[#A0524F]/10',
};

const ACTIVE_STATUSES = new Set(['pending', 'preparing', 'ready']);

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const todayStr = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const dateStr = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

  if (dateStr === todayStr) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(yesterday);
  if (dateStr === yesterdayStr) return 'Yesterday';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: STORE_TIMEZONE,
  }).format(date);
}

function TeaCupIllustration() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      className="mx-auto"
      aria-hidden="true"
    >
      {/* Steam wisps */}
      <path
        d="M45 28c0-8 6-12 3-20"
        stroke="#D4C5B2"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M60 24c0-6 4-10 2-18"
        stroke="#D4C5B2"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M75 28c0-8 6-12 3-20"
        stroke="#D4C5B2"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      {/* Cup body */}
      <path
        d="M30 40h60l-8 55a8 8 0 0 1-8 7H46a8 8 0 0 1-8-7L30 40z"
        fill="#F5F0E8"
        stroke="#D4C5B2"
        strokeWidth="2"
      />
      {/* Tea surface */}
      <ellipse cx="60" cy="52" rx="26" ry="4" fill="#8B9F82" opacity="0.3" />
      {/* Boba dots */}
      <circle cx="48" cy="82" r="4" fill="#6B5344" opacity="0.6" />
      <circle cx="60" cy="86" r="4" fill="#6B5344" opacity="0.5" />
      <circle cx="72" cy="82" r="4" fill="#6B5344" opacity="0.6" />
      <circle cx="54" cy="90" r="3.5" fill="#6B5344" opacity="0.4" />
      <circle cx="66" cy="90" r="3.5" fill="#6B5344" opacity="0.4" />
      {/* Cup rim highlight */}
      <path
        d="M32 40h56"
        stroke="#E8DDD0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Straw */}
      <line
        x1="70"
        y1="18"
        x2="65"
        y2="70"
        stroke="#8B9F82"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrderCard({ order }: { order: Parameters<typeof OrdersContent>[0]['orders'][number] }) {
  const itemsSummary = order.items
    .map((item) =>
      item.quantity > 1 ? `${item.quantity}\u00d7 ${item.name}` : item.name,
    )
    .join(', ');

  const statusColor = STATUS_COLORS[order.status] ?? '#8C7B6B';
  const statusBg = STATUS_BG[order.status] ?? 'bg-[#8C7B6B]/10';

  return (
    <li className="space-y-3 rounded-2xl border border-[#E8DDD0] bg-white p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg
            className="shrink-0 text-[#8B9F82]"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          <span className="text-sm font-semibold text-[#6B5344]">
            {order.orderNumber}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#8C7B6B]">
          <svg
            className="shrink-0"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>{formatRelativeDate(order.createdAt)}</span>
        </div>
      </div>

      <div className="space-y-1.5 text-sm">
        <p className="text-[#8C7B6B]">
          <span className="text-[#6B5344]">Items:</span> {itemsSummary}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[#6B5344]">
            {formatMoney(toMoney(order.totalPriceInCents))}
          </p>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBg}`}
            style={{ color: statusColor }}
          >
            {order.status === 'preparing' && (
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
            )}
            {order.status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#E8DDD0] pt-3">
        {order.status === 'pending' ? (
          <CancelOrderButton orderId={order.id} />
        ) : (
          <div />
        )}
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F0E8] px-3 py-1.5 text-xs font-medium text-[#6B5344] transition-colors hover:bg-[#E8DDD0]"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          Reorder
        </Link>
      </div>
    </li>
  );
}

function OrdersContent({ orders }: { orders: Awaited<ReturnType<typeof getUserOrders>> }) {
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.has(o.status));
  const pastOrders = orders.filter((o) => !ACTIVE_STATUSES.has(o.status));

  return (
    <div className="space-y-6">
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#8B9F82]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8B9F82]">
              Active Orders
            </h2>
          </div>
          <ul className="space-y-3">
            {activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
        </div>
      )}

      {pastOrders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#B5A898]">
            Past Orders
          </h2>
          <ul className="space-y-3">
            {pastOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default async function OrdersPage(): Promise<JSX.Element> {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    return redirectToSignIn();
  }

  const orders = await getUserOrders(userId);

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#E8DDD0]"
          aria-label="Back to profile"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#6B5344]"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="font-display text-3xl text-[#6B5344]">Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#D4C5B2] bg-white px-6 py-10">
          <TeaCupIllustration />
          <h2 className="mt-4 font-display text-xl text-[#6B5344]">No orders yet</h2>
          <p className="mt-1.5 text-center text-sm text-[#8C7B6B]">
            Your order history will appear here once you place your first order.
          </p>
          <Link
            href="/menu"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#8B9F82] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7A8E72]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 3h18v18H3z" opacity="0" />
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M12 11v6M9 14h6" />
            </svg>
            Browse our menu
          </Link>
        </div>
      ) : (
        <OrdersContent orders={orders} />
      )}
    </section>
  );
}
