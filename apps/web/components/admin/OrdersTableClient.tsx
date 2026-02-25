'use client';

import { useState, useCallback } from 'react';
import type { Order } from '@vetea/shared';
import { formatMoney, toMoney } from '@vetea/shared';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';
import { BulkOrderActions } from '@/components/admin/BulkOrderActions';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[#8C7B6B]/10 text-[#8C7B6B]',
  preparing: 'bg-[#C4A35A]/10 text-[#C4A35A]',
  ready: 'bg-[#8B9F82]/10 text-[#8B9F82]',
  completed: 'bg-[#8B9F82]/10 text-[#8B9F82]',
  cancelled: 'bg-[#A0524F]/10 text-[#A0524F]',
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

interface OrdersTableClientProps {
  orders: Order[];
  label: string;
}

export function OrdersTableClient({ orders, label }: OrdersTableClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allIds = orders.map((o) => o.id);
  const allSelected = orders.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = allIds.some((id) => selectedIds.has(id));

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        for (const id of allIds) next.delete(id);
      } else {
        for (const id of allIds) next.add(id);
      }
      return next;
    });
  }, [allIds, allSelected]);

  const toggleOne = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2]">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected && !allSelected;
                    }}
                    onChange={toggleAll}
                    aria-label={`Select all ${label}`}
                    className="h-4 w-4 rounded border-[#D4C5B2] text-[#8B9F82] accent-[#8B9F82]"
                  />
                </th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Order #</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Date</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Items</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Total</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Status</th>
                <th className="px-4 py-3 font-medium text-[#8C7B6B]">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[#8C7B6B]">
                    No orders found.
                  </td>
                </tr>
              )}
              {orders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`border-b border-[#E8DDD0] transition-colors hover:bg-[#FAF7F2] ${
                    idx % 2 === 1 ? 'bg-[#FDFCF9]' : ''
                  } ${selectedIds.has(order.id) ? 'bg-[#8B9F82]/5' : ''}`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => toggleOne(order.id)}
                      aria-label={`Select order ${order.orderNumber}`}
                      className="h-4 w-4 rounded border-[#D4C5B2] text-[#8B9F82] accent-[#8B9F82]"
                    />
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-[#6B5344]">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-[#6B5344]">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-[#6B5344]">
                    <span className="font-medium">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                    <span className="ml-1 text-[#8C7B6B]">
                      item{order.items.reduce((sum, item) => sum + item.quantity, 0) !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#6B5344]">
                    {formatMoney(toMoney(order.totalPriceInCents))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_COLORS[order.status] ?? ''}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <BulkOrderActions selectedIds={selectedIds} onClearSelection={clearSelection} />
    </>
  );
}
