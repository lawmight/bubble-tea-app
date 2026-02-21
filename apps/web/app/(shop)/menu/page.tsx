import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { MenuGrid } from '@/components/shop/MenuGrid';

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

function ProductGridSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-56 animate-pulse rounded-2xl bg-[#efe5d8]" />
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
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[#2a2a2a]">Menu</h1>
        <p className="text-sm text-[#6f5a44]">Choose your base, sweetness, and toppings.</p>
      </header>

      <nav aria-label="Menu categories" className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((item) => {
          const selected = (activeCategory ?? 'all') === item.value;
          const href = item.value === 'all' ? '/menu' : `/menu?category=${item.value}`;
          return (
            <Link
              key={item.value}
              href={href}
              className={`rounded-full border px-3 py-1 text-sm ${
                selected
                  ? 'border-[#245741] bg-[#245741] text-white'
                  : 'border-[#d8c7b0] bg-white text-[#5b4632]'
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
