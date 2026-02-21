import type { ReactNode } from 'react';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { AdminSidebarShell } from '@/components/admin/AdminSidebarShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  if (!userId || role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <AdminSidebarShell />
      <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-8 md:pb-8">{children}</main>
    </div>
  );
}
