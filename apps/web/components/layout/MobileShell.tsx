import type { ReactNode } from 'react';

import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';

interface MobileShellProps {
  children: ReactNode;
}

export async function MobileShell({ children }: MobileShellProps): Promise<JSX.Element> {
  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto min-h-[calc(100dvh-8.5rem)] max-w-screen-md px-4 py-6 pb-24">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
