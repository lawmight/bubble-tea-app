'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { OrderItem } from '@vetea/shared/client';

import { useCart } from '@/hooks/use-cart';

interface ReorderButtonProps {
  items: OrderItem[];
}

export function ReorderButton({ items }: ReorderButtonProps): JSX.Element {
  const { addItem } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F0E8] px-3 py-1.5 text-xs font-medium text-[#6B5344] transition-colors hover:bg-[#E8DDD0]"
      onClick={() => {
        for (const item of items) {
          addItem({
            productId: item.productId,
            productSlug: '',
            name: item.name,
            image: '',
            quantity: item.quantity,
            basePriceInCents: item.unitPriceInCents,
            unitPriceInCents: item.unitPriceInCents,
            selection: {
              size: item.size,
              sugar: item.sugar,
              ice: item.ice,
              toppings: item.toppings,
            },
            addedAt: new Date().toISOString(),
          });
        }
        toast('Items added to cart');
        router.push('/cart');
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
      Reorder
    </button>
  );
}
