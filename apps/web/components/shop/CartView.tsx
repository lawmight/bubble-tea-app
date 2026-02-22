'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';

import { formatMoney, toMoney } from '@vetea/shared/client';

import { CartItem } from '@/components/shop/CartItem';
import { useCart } from '@/hooks/use-cart';

const TAX_RATE = 0.08875;

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
    () =>
      items.reduce(
        (total, item) =>
          total + (item.unitPriceInCents ?? item.basePriceInCents) * item.quantity,
        0,
      ),
    [items],
  );

  const taxInCents = useMemo(() => Math.round(subtotalInCents * TAX_RATE), [subtotalInCents]);
  const totalInCents = subtotalInCents + taxInCents;

  if (items.length === 0) {
    return (
      <section className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-[#D4C5B2] bg-white px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0E8]">
          <span className="text-3xl" role="img" aria-label="Bubble tea">🧋</span>
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#6B5344]">Your cart is empty</h1>
          <p className="text-sm text-[#8C7B6B]">
            Find your favorite drink from the menu and add it here.
          </p>
        </div>
        <Link
          href="/menu"
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#8B9F82] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#7A8E72] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82]"
        >
          Browse Menu
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {/* VETEA order banner */}
      <div className="flex items-center gap-2 rounded-xl bg-[#8B9F82]/10 px-4 py-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
          <path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z" fill="#8B9F82" />
          <path d="M12 22a6 6 0 01-6-6c0-3.5 3-5 6-9" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-semibold text-[#6B5344]">Your order from VETEA</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#6B5344]">Your Cart</h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-medium text-[#8C7B6B] underline-offset-2 transition-colors hover:text-[#6B5344] hover:underline"
        >
          Clear all
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className="space-y-3">
        {items.map((item) => {
          const mergeKey = buildMergeKey(item);
          return (
            <div key={mergeKey} className="animate-cart-item-in">
              <CartItem
                item={item}
                onDecrease={() => updateQuantity(mergeKey, item.quantity - 1)}
                onIncrease={() => updateQuantity(mergeKey, item.quantity + 1)}
                onRemove={() => removeItem(mergeKey)}
              />
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#E8DDD0] bg-white p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between text-[#8C7B6B]">
            <span>Subtotal</span>
            <span>{formatMoney(toMoney(subtotalInCents))}</span>
          </div>
          <div className="flex items-center justify-between text-[#8C7B6B]">
            <span>Tax</span>
            <span>{formatMoney(toMoney(taxInCents))}</span>
          </div>
          <div className="my-1 border-t border-[#E8DDD0]" />
          <div className="flex items-center justify-between font-bold text-[#6B5344]">
            <span>Total</span>
            <span className="text-base">{formatMoney(toMoney(totalInCents))}</span>
          </div>
        </div>

        {/* Estimated pickup time */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#8B9F82]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-gentle-pulse">
            <circle cx="12" cy="12" r="10" stroke="#8B9F82" strokeWidth="2" />
            <path d="M12 6v6l4 2" stroke="#8B9F82" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-medium">Ready in ~10-15 min</span>
        </div>

        <p className="mt-2 text-[10px] text-[#8C7B6B]">
          Final pricing confirmed at checkout.
        </p>

        <Link
          href="/checkout"
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8B9F82] text-sm font-bold text-white transition-colors hover:bg-[#7A8E72] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82]"
        >
          <span>Proceed to Checkout</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
