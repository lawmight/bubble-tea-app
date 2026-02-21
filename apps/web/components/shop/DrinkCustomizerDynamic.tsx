'use client';

import dynamic from 'next/dynamic';
import type { Product } from '@vetea/shared/client';

const DrinkCustomizer = dynamic(
  () => import('@/components/shop/DrinkCustomizer').then((mod) => mod.DrinkCustomizer),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 animate-pulse space-y-6" aria-busy="true">
        <div className="space-y-3">
          <div className="h-4 w-10 rounded bg-[#efe5d8]" />
          <div className="flex gap-2">
            <div className="h-9 w-20 rounded-full bg-[#efe5d8]" />
            <div className="h-9 w-24 rounded-full bg-[#efe5d8]" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-12 rounded bg-[#efe5d8]" />
          <div className="flex gap-2">
            <div className="h-9 w-12 rounded-full bg-[#efe5d8]" />
            <div className="h-9 w-12 rounded-full bg-[#efe5d8]" />
            <div className="h-9 w-12 rounded-full bg-[#efe5d8]" />
            <div className="h-9 w-12 rounded-full bg-[#efe5d8]" />
            <div className="h-9 w-14 rounded-full bg-[#efe5d8]" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-8 rounded bg-[#efe5d8]" />
          <div className="flex gap-2">
            <div className="h-9 w-16 rounded-full bg-[#efe5d8]" />
            <div className="h-9 w-14 rounded-full bg-[#efe5d8]" />
            <div className="h-9 w-16 rounded-full bg-[#efe5d8]" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-16 rounded bg-[#efe5d8]" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-[#efe5d8]" />
              <div className="h-4 w-12 rounded bg-[#efe5d8]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-[#efe5d8]" />
              <div className="h-4 w-16 rounded bg-[#efe5d8]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-[#efe5d8]" />
              <div className="h-4 w-20 rounded bg-[#efe5d8]" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
);

interface DrinkCustomizerDynamicProps {
  product: Product;
}

export function DrinkCustomizerDynamic({ product }: DrinkCustomizerDynamicProps): JSX.Element {
  return <DrinkCustomizer product={product} />;
}
