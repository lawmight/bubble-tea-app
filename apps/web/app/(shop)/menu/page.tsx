import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import { MenuGrid } from '@/components/shop/MenuGrid';
import { SearchBar } from '@/components/shop/SearchBar';
import { SortSelect } from '@/components/shop/SortSelect';
import { getProducts } from '@/lib/queries/products';

const CATEGORIES = [
  {
    value: 'all',
    label: 'All',
    icon: null,
  },
  {
    value: 'milk-tea',
    label: 'Milk Tea',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M12 8h16l-2 24H14L12 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 8h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="17" cy="25" r="1.5" fill="currentColor" opacity="0.5" />
        <circle cx="23" cy="24" r="1.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    value: 'fruit-tea',
    label: 'Fruit Tea',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-4 w-4" aria-hidden="true">
        <circle cx="20" cy="22" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M20 12c0-4 3-6 6-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M20 12c-2-3 0-7 3-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M16 20c2-1 5-1 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: 'special',
    label: 'Special',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M20 6l3.09 9.51h10l-8.09 5.88 3.09 9.51L20 25.02l-8.09 5.88 3.09-9.51L6.91 15.5h10L20 6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    value: 'classic',
    label: 'Classic',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-4 w-4" aria-hidden="true">
        <path d="M14 14c2-6 10-6 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M12 14h16c0 8-3 14-8 18-5-4-8-10-8-18z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M18 20c1 2 3 2 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
];

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Browse VETEA bubble tea categories and drinks.',
};

export const revalidate = 3600;

async function DrinkCount(): Promise<JSX.Element> {
  const products = await getProducts();
  return (
    <span className="text-lg font-normal not-italic text-[var(--color-text-secondary)]">
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
          className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]"
          style={{ opacity: 1 - index * 0.08 }}
        >
          <div className="shimmer aspect-square rounded-t-2xl" />
          <div className="space-y-2.5 px-3 py-3">
            <div className="mx-auto h-4 w-3/4 rounded-full bg-[var(--color-bg-muted)]" />
            <div className="mx-auto h-3 w-1/2 rounded-full bg-[var(--color-bg-muted)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface MenuPageProps {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}

function buildCategoryHref(
  categoryValue: string,
  currentParams: { q?: string; sort?: string },
): string {
  const params = new URLSearchParams();
  if (categoryValue !== 'all') params.set('category', categoryValue);
  if (currentParams.q) params.set('q', currentParams.q);
  if (currentParams.sort) params.set('sort', currentParams.sort);
  const qs = params.toString();
  return `/menu${qs ? `?${qs}` : ''}`;
}

export default async function MenuPage({ searchParams }: MenuPageProps): Promise<JSX.Element> {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const query = resolvedParams.q;
  const sort = resolvedParams.sort;
  const activeCategory = category && category !== 'all' ? category : undefined;

  return (
    <div className="space-y-5">
      <Suspense fallback={null}>
        <SearchBar />
      </Suspense>

      <div className="animate-fade-in-up animate-delay-100 flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl italic text-[var(--color-accent)]">
          Menu{' '}
          <Suspense fallback={null}>
            <DrinkCount />
          </Suspense>
        </h1>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      <nav
        aria-label="Menu categories"
        className="animate-fade-in-up animate-delay-200 hide-scrollbar flex gap-2 overflow-x-auto pb-1"
      >
        {CATEGORIES.map((item) => {
          const selected = (activeCategory ?? 'all') === item.value;
          const href = buildCategoryHref(item.value, { q: query, sort });
          return (
            <Link
              key={item.value}
              href={href}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                selected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-sm'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-accent)] hover:border-[var(--color-primary-muted)] hover:shadow-sm'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Suspense fallback={<ProductGridSkeleton />}>
        <MenuGrid category={activeCategory} query={query} sort={sort} />
      </Suspense>
    </div>
  );
}
