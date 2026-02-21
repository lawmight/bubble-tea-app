import { getProducts } from '@/lib/queries/products';

import { ProductCard } from './ProductCard';

interface MenuGridProps {
  category?: string;
}

export async function MenuGrid({ category }: MenuGridProps): Promise<JSX.Element> {
  const products = await getProducts(category);

  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[#D4C5B2] p-8 text-center text-sm text-[#8C7B6B]">
        No drinks found for this category.
      </p>
    );
  }

  return (
    <section aria-label="Menu products" className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} index={index} />
      ))}
    </section>
  );
}
