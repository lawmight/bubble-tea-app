import type { Metadata } from 'next';
import Link from 'next/link';

import { formatMoney, toMoney, STORE_TIMEZONE } from '@vetea/shared';

import { getAllOrders, getAllProducts } from '@/lib/queries/admin';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E8DDD0] bg-white p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F0E8] text-[#8B9F82]">
        {icon}
      </div>
      <p className="text-sm text-[#8C7B6B]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#6B5344]">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[#8C7B6B]">{sub}</p>}
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[#8C7B6B]/10 text-[#8C7B6B]',
  preparing: 'bg-[#C4A35A]/10 text-[#C4A35A]',
  ready: 'bg-[#8B9F82]/10 text-[#8B9F82]',
  completed: 'bg-[#8B9F82]/10 text-[#8B9F82]',
  cancelled: 'bg-[#A0524F]/10 text-[#A0524F]',
};

export default async function AdminDashboardPage() {
  const [products, orders] = await Promise.all([getAllProducts(), getAllOrders()]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.available).length;
  const activeOrders = orders.filter((o) => ['pending', 'preparing', 'ready'].includes(o.status)).length;
  const completedToday = orders.filter(
    (o) => o.status === 'completed' && new Date(o.updatedAt) >= today,
  ).length;
  const revenueToday = orders
    .filter((o) => o.status === 'completed' && new Date(o.updatedAt) >= today)
    .reduce((sum, o) => sum + o.totalPriceInCents, 0);

  const recentOrders = orders.slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#6B5344]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#8C7B6B]">Overview of your bubble tea shop</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          }
          label="Total Products"
          value={String(totalProducts)}
          sub={`${availableProducts} available`}
        />
        <StatCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          }
          label="Active Orders"
          value={String(activeOrders)}
          sub="Pending + Preparing + Ready"
        />
        <StatCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          }
          label="Completed Today"
          value={String(completedToday)}
        />
        <StatCard
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
          }
          label="Revenue Today"
          value={formatMoney(toMoney(revenueToday))}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl text-[#6B5344]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-[#8B9F82] hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#D4C5B2] bg-white p-8 text-center text-sm text-[#8C7B6B]">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8DDD0] bg-[#FAF7F2]">
                  <th className="px-4 py-3 font-medium text-[#8C7B6B]">Order</th>
                  <th className="hidden px-4 py-3 font-medium text-[#8C7B6B] sm:table-cell">Items</th>
                  <th className="px-4 py-3 font-medium text-[#8C7B6B]">Total</th>
                  <th className="px-4 py-3 font-medium text-[#8C7B6B]">Status</th>
                  <th className="hidden px-4 py-3 font-medium text-[#8C7B6B] md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDD0]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#FAF7F2]">
                    <td className="px-4 py-3 font-medium text-[#6B5344]">{order.orderNumber}</td>
                    <td className="hidden px-4 py-3 text-[#8C7B6B] sm:table-cell">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} drinks
                    </td>
                    <td className="px-4 py-3 font-medium text-[#6B5344]">
                      {formatMoney(toMoney(order.totalPriceInCents))}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[order.status] ?? ''}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-[#8C7B6B] md:table-cell">
                      {new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                        timeZone: STORE_TIMEZONE,
                      }).format(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/products"
          className="group flex items-center gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B9F82]/10 text-[#8B9F82] transition-colors group-hover:bg-[#8B9F82]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div>
            <p className="font-semibold text-[#6B5344]">Manage Products</p>
            <p className="text-sm text-[#8C7B6B]">Add, edit, or remove drinks from the menu</p>
          </div>
        </Link>
        <Link
          href="/admin/orders"
          className="group flex items-center gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B9F82]/10 text-[#8B9F82] transition-colors group-hover:bg-[#8B9F82]/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></svg>
          </div>
          <div>
            <p className="font-semibold text-[#6B5344]">Manage Orders</p>
            <p className="text-sm text-[#8C7B6B]">Update status, view order details</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
