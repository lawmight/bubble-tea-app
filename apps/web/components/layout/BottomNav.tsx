'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useTransition } from 'react';

import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {active ? (
        <path
          d="M12 2.1L1 12h3v9a1 1 0 001 1h4v-6h6v6h4a1 1 0 001-1v-9h3L12 2.1z"
          fill="currentColor"
        />
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12l8-7 8 7" />
          <path d="M6 10.5V20a1 1 0 001 1h10a1 1 0 001-1V10.5" />
          <path d="M10 21v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
        </g>
      )}
    </svg>
  );
}

function MenuIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {active ? (
        <g fill="currentColor">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
        </g>
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="8" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
          <rect x="13" y="13" width="8" height="8" rx="2" />
        </g>
      )}
    </svg>
  );
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {active ? (
        <g>
          <path
            d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"
            fill="currentColor"
          />
          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M16 10a4 4 0 01-8 0"
            stroke="#F5F0E8"
            strokeWidth="1.75"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 01-8 0" />
        </g>
      )}
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {active ? (
        <g fill="currentColor">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1h16z" />
        </g>
      ) : (
        <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" />
        </g>
      )}
    </svg>
  );
}

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/menu', label: 'Menu', icon: MenuIcon },
  { href: '/cart', label: 'Cart', icon: CartIcon },
  { href: '/profile', label: 'Profile', icon: ProfileIcon },
];

export function BottomNav(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { count } = useCart();

  useEffect(() => {
    NAV_ITEMS.forEach((item) => router.prefetch(item.href));
  }, [router]);

  return (
    <nav
      aria-label="Mobile"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E8DDD0] bg-white pb-[env(safe-area-inset-bottom,0.25rem)]"
    >
      {isPending && (
        <div
          className="absolute inset-x-0 top-0 h-0.5 animate-pulse rounded-full bg-[#8B9F82]/70"
          aria-hidden
        />
      )}
      <ul className="mx-auto grid max-w-screen-sm grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          const isCart = item.label === 'Cart';

          return (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => {
                  if (pathname === item.href) return;
                  startTransition(() => router.push(item.href));
                }}
                className={cn(
                  'flex w-full flex-col items-center justify-center gap-0.5 py-2 transition-colors',
                  active ? 'text-[#6B5344]' : 'text-[#A89B8C]',
                  isPending && active && 'opacity-80',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span className="relative">
                  <Icon active={active} />
                  {isCart && count > 0 && (
                    <span
                      className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B9F82] px-1 text-[10px] font-bold leading-none text-white"
                      aria-label={`${count} item${count === 1 ? '' : 's'} in cart`}
                    >
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    'text-[10px] leading-tight',
                    active ? 'font-semibold' : 'font-medium',
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
