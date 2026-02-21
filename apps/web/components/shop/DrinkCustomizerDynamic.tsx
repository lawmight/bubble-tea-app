'use client';

import dynamic from 'next/dynamic';
import type { Product } from '@vetea/shared';

const DrinkCustomizer = dynamic(
  () => import('@/components/shop/DrinkCustomizer').then((mod) => mod.DrinkCustomizer),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 animate-pulse rounded-2xl bg-[#efe5d8]" aria-busy="true" />
    ),
  },
);

interface DrinkCustomizerDynamicProps {
  product: Product;
}

export function DrinkCustomizerDynamic({ product }: DrinkCustomizerDynamicProps): JSX.Element {
  return <DrinkCustomizer product={product} />;
}
