import { getAllOrders } from '@/lib/queries/admin';
import { OrdersTableClient } from '@/components/admin/OrdersTableClient';

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
          <OrdersTableClient orders={activeOrders} label="active orders" />
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8C7B6B]">
          {activeOrders.length > 0 ? 'Past Orders' : 'All Orders'} ({pastOrders.length > 0 ? pastOrders.length : orders.length})
        </h2>
        <OrdersTableClient
          orders={activeOrders.length > 0 ? pastOrders : orders}
          label={activeOrders.length > 0 ? 'past orders' : 'all orders'}
        />
      </div>

      <p className="text-sm text-[#8C7B6B]">
        {orders.length} order{orders.length !== 1 ? 's' : ''} total
      </p>
    </div>
  );
}
