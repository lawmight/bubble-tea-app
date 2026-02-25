'use client';

import { useQuery } from '@tanstack/react-query';
import { formatMoney, toMoney, type Order } from '@vetea/shared/client';

import { CancelOrderButton } from '@/components/shop/CancelOrderButton';
import { ReorderButton } from '@/components/shop/ReorderButton';

const ACTIVE_STATUSES = new Set(['pending', 'preparing', 'ready']);

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

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);

  const todayStr = fmt(now);
  const dateStr = fmt(date);
  if (dateStr === todayStr) return 'Today';

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (fmt(yesterday) === dateStr) return 'Yesterday';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function ActiveOrderCard({ order }: { order: Order }) {
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
        <ReorderButton items={order.items} />
      </div>
    </li>
  );
}

interface OrdersLiveListProps {
  initialOrders: Order[];
}

export function OrdersLiveList({ initialOrders }: OrdersLiveListProps): JSX.Element {
  const { data: orders } = useQuery<Order[]>({
    queryKey: ['active-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const json = (await res.json()) as { data?: Order[] };
      const allOrders = (json.data ?? []).map((o) => ({
        ...o,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
        estimatedReadyAt: o.estimatedReadyAt ? new Date(o.estimatedReadyAt) : undefined,
      }));
      return allOrders.filter((o) => ACTIVE_STATUSES.has(o.status));
    },
    initialData: initialOrders.filter((o) => ACTIVE_STATUSES.has(o.status)),
    refetchInterval: 10_000,
  });

  const activeOrders = orders ?? [];

  if (activeOrders.length === 0) return <></>;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#8B9F82]" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8B9F82]">
          Active Orders
        </h2>
        <span className="rounded-full bg-[#8B9F82]/10 px-2 py-0.5 text-[10px] font-semibold text-[#8B9F82]">
          Live
        </span>
      </div>
      <ul className="space-y-3">
        {activeOrders.map((order) => (
          <ActiveOrderCard key={order.id} order={order} />
        ))}
      </ul>
    </div>
  );
}
