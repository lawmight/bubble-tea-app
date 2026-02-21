'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';

import { formatMoney, toMoney } from '@vetea/shared';

import { CartItem } from '@/components/shop/CartItem';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

function buildMergeKey(item: {
  productId: string;
  selection: { size: string; sugar: string; ice: string; toppings: string[] };
}): string {
  return [
    item.productId,
    item.selection.size,
    item.selection.sugar,
    item.selection.ice,
    item.selection.toppings.slice().sort().join('|'),
  ].join(':');
}

export function CartView(): JSX.Element {
  const { items, announcement, removeItem, updateQuantity, clearCart, refreshAvailability } =
    useCart();

  useEffect(() => {
    void refreshAvailability();
  }, [refreshAvailability]);

  const subtotalInCents = useMemo(
    () => items.reduce((total, item) => total + item.basePriceInCents * item.quantity, 0),
    [items],
  );

  if (items.length === 0) {
    return (
      <section className="space-y-4 rounded-2xl border border-dashed border-[#d8c7b0] bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-[#2a2a2a]">Your cart is empty</h1>
        <p className="text-sm text-[#6f5a44]">Pick your favorite drink from the menu.</p>
        <Link
          href="/menu"
          className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl bg-[#245741] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1f4a37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245741]"
        >
          Browse menu
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2a2a2a]">Cart</h1>
        <Button variant="ghost" onClick={clearCart}>
          Clear cart
        </Button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="space-y-3">
        {items.map((item) => {
          const mergeKey = buildMergeKey(item);
          return (
            <CartItem
              key={mergeKey}
              item={item}
              onDecrease={() => updateQuantity(mergeKey, item.quantity - 1)}
              onIncrease={() => updateQuantity(mergeKey, item.quantity + 1)}
              onRemove={() => removeItem(mergeKey)}
            />
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#e6dac9] bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#6f5a44]">Estimated subtotal</p>
          <p className="text-lg font-semibold text-[#245741]">
            {formatMoney(toMoney(subtotalInCents))}
          </p>
        </div>
        <p className="mt-1 text-xs text-[#7e6d58]">
          Final pricing is confirmed at checkout on the server.
        </p>
        <Link
          href="/checkout"
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#245741] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1f4a37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245741]"
        >
          Continue to checkout
        </Link>
      </div>
    </section>
  );
}
