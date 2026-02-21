import { formatMoney, toMoney } from '@vetea/shared';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect';
import { getAllOrders } from '@/lib/queries/admin';

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

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  const activeOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready',
  );
  const pastOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled',
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#6B5344]">Orders</h1>

      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8C7B6B]">
            Active Orders ({activeOrders.length})
          </h2>
          <OrderTable orders={activeOrders} />
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8C7B6B]">
          {activeOrders.length > 0 ? 'Past Orders' : 'All Orders'} ({pastOrders.length > 0 ? pastOrders.length : orders.length})
        </h2>
        <OrderTable orders={activeOrders.length > 0 ? pastOrders : orders} />
      </div>

      <p className="text-sm text-[#8C7B6B]">
        {orders.length} order{orders.length !== 1 ? 's' : ''} total
      </p>
    </div>
  );
}

interface OrderTableProps {
  orders: Awaited<ReturnType<typeof getAllOrders>>;
}

function OrderTable({ orders }: OrderTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2]">
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
                <td colSpan={6} className="px-4 py-12 text-center text-[#8C7B6B]">
                  No orders found.
                </td>
              </tr>
            )}
            {orders.map((order, idx) => (
              <tr
                key={order.id}
                className={`border-b border-[#E8DDD0] transition-colors hover:bg-[#FAF7F2] ${
                  idx % 2 === 1 ? 'bg-[#FDFCF9]' : ''
                }`}
              >
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
  );
}
