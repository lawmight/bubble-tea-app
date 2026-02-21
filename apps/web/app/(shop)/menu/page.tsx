import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { MenuGrid } from '@/components/shop/MenuGrid';
import { getProducts } from '@/lib/queries/products';

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'milk-tea', label: 'Milk Tea' },
  { value: 'fruit-tea', label: 'Fruit Tea' },
  { value: 'special', label: 'Special' },
  { value: 'classic', label: 'Classic' },
];

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Browse VETEA bubble tea categories and drinks.',
};

export const revalidate = 3600;

async function DrinkCount(): Promise<JSX.Element> {
  const products = await getProducts();
  return (
    <span className="text-lg font-normal not-italic text-[#8C7B6B]">
      &middot; {products.length} drinks
    </span>
  );
}

function ProductGridSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-[#D4C5B2] bg-white"
          style={{ opacity: 1 - index * 0.08 }}
        >
          <div className="shimmer aspect-square rounded-t-2xl" />
          <div className="space-y-2.5 px-3 py-3">
            <div className="mx-auto h-4 w-3/4 rounded-full bg-[#E8DDD0]" />
            <div className="mx-auto h-3 w-1/2 rounded-full bg-[#E8DDD0]" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface MenuPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const activeCategory = category && category !== 'all' ? category : undefined;

  return (
    <div className="space-y-5">
      <Link
        href="/menu"
        className="animate-fade-in-up flex items-center gap-2.5 rounded-xl border border-[#D4C5B2] bg-white px-4 py-2.5 text-sm text-[#8C7B6B] transition-colors hover:border-[#8B9F82]"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Search drinks&hellip;
      </Link>

      <h1 className="animate-fade-in-up animate-delay-100 font-display text-3xl italic text-[#6B5344]">
        Menu{' '}
        <Suspense fallback={null}>
          <DrinkCount />
        </Suspense>
      </h1>

      <nav
        aria-label="Menu categories"
        className="animate-fade-in-up animate-delay-200 hide-scrollbar flex gap-2 overflow-x-auto pb-1"
      >
        {CATEGORIES.map((item) => {
          const selected = (activeCategory ?? 'all') === item.value;
          const href = item.value === 'all' ? '/menu' : `/menu?category=${item.value}`;
          return (
            <Link
              key={item.value}
              href={href}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                selected
                  ? 'border-[#8B9F82] bg-[#8B9F82] text-white shadow-sm'
                  : 'border-[#D4C5B2] bg-white text-[#6B5344] hover:border-[#8B9F82]/50 hover:shadow-sm'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Suspense fallback={<ProductGridSkeleton />}>
        <MenuGrid category={activeCategory} />
      </Suspense>
    </div>
  );
}
