import type { Product } from '@vetea/shared';

import { getProducts } from '@/lib/queries/products';

import { ProductCard } from './ProductCard';

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'name-asc';

interface MenuGridProps {
  category?: string;
  query?: string;
  sort?: string;
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.basePriceInCents - b.basePriceInCents);
    case 'price-desc':
      return sorted.sort((a, b) => b.basePriceInCents - a.basePriceInCents);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export async function MenuGrid({ category, query, sort }: MenuGridProps): Promise<JSX.Element> {
  const products = await getProducts(category, query);
  const sorted = sortProducts(products, (sort as SortOption) ?? 'popular');

  if (sorted.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-text-secondary)]">
        {query ? `No drinks found for \u201c${query}\u201d.` : 'No drinks found for this category.'}
      </p>
    );
  }

  return (
    <section aria-label="Menu products" className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {sorted.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} index={index} />
      ))}
    </section>
  );
}
