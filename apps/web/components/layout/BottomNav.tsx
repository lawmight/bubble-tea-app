'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/cart', label: 'Cart' },
  { href: '/profile', label: 'Profile' },
];

export function BottomNav(): JSX.Element {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e6dac9] bg-white/95 px-2 pb-2 pt-1 backdrop-blur"
    >
      <ul className="mx-auto grid max-w-screen-sm grid-cols-4 gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex min-h-11 items-center justify-center rounded-lg text-xs font-semibold transition-colors',
                  active
                    ? 'bg-[#245741] text-white'
                    : 'text-[#6f5a44] hover:bg-[#f8f4ed] hover:text-[#245741]',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
