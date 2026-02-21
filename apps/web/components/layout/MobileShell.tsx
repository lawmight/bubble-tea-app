import type { ReactNode } from 'react';

import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';

interface MobileShellProps {
  children: ReactNode;
}

export async function MobileShell({ children }: MobileShellProps): Promise<JSX.Element> {
  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F0E8]">
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-24"
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
