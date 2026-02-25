'use client';

import { useRef, useState } from 'react';
import { formatMoney, toMoney, type CartItem as CartItemType } from '@vetea/shared/client';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

const SWIPE_THRESHOLD = 80;

export function CartItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemProps): JSX.Element {
  const unitPrice = item.unitPriceInCents ?? item.basePriceInCents;
  const isLastItem = item.quantity <= 1;

  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);
  const currentOffsetRef = useRef(0);

  function handleTouchStart(e: React.TouchEvent) {
    startXRef.current = e.touches[0].clientX;
    currentOffsetRef.current = 0;
    setIsSwiping(true);
  }

  function handleTouchMove(e: React.TouchEvent) {
    const delta = e.touches[0].clientX - startXRef.current;
    const clamped = Math.min(0, delta);
    currentOffsetRef.current = clamped;
    setOffsetX(clamped);
  }

  function handleTouchEnd() {
    setIsSwiping(false);
    if (currentOffsetRef.current < -SWIPE_THRESHOLD) {
      setOffsetX(-300);
      setTimeout(onRemove, 200);
    } else {
      setOffsetX(0);
    }
    currentOffsetRef.current = 0;
  }

  function handleDecrease() {
    if (isLastItem) {
      onRemove();
    } else {
      onDecrease();
    }
  }

  const optionsSummary = [
    item.selection.size,
    item.selection.sugar,
    item.selection.ice,
    ...(item.selection.toppings.length > 0 ? item.selection.toppings : []),
  ].join(' · ');

  const lineTotalInCents = unitPrice * item.quantity;
  const swipeProgress = Math.min(Math.abs(offsetX) / SWIPE_THRESHOLD, 1);

  return (
    <article className="relative overflow-hidden rounded-2xl">
      {/* Red delete zone behind the card */}
      <div
        className="absolute inset-0 flex items-center justify-end rounded-2xl px-5"
        style={{
          background: `var(--color-danger)`,
          opacity: swipeProgress,
        }}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: swipeProgress }}>
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 11v6M14 11v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Swipeable card */}
      <div
        className="relative rounded-2xl border border-[var(--color-border-card)] bg-[var(--color-bg-card)] p-3"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Swipe hint (mobile only, fades out) */}
        <div className="animate-swipe-hint pointer-events-none absolute right-3 top-1.5 flex items-center gap-1 text-[10px] text-[var(--color-text-secondary)] sm:hidden" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l5-5M5 12l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Swipe to remove
        </div>

        <div className="grid grid-cols-[80px_1fr] gap-3">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg)]">
            <Image
              src={item.image}
              alt={`${item.name} in cart`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="min-w-0 flex flex-col justify-between">
            <div>
              <h3 className="truncate text-base font-bold leading-tight text-[var(--color-accent)]">{item.name}</h3>
              <p className="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">{optionsSummary}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrease}
                  aria-label={
                    isLastItem ? `Remove ${item.name} from cart` : `Decrease quantity for ${item.name}`
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-bg-card)] text-base font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/10 active:bg-[var(--color-primary)]/20"
                >
                  −
                </button>
                <span className="min-w-6 text-center text-sm font-bold text-[var(--color-accent)]">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={onIncrease}
                  aria-label={`Increase quantity for ${item.name}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-primary)] bg-[var(--color-bg-card)] text-base font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/10 active:bg-[var(--color-primary)]/20"
                >
                  +
                </button>
              </div>

              {/* Line total */}
              <p className="text-sm font-bold text-[var(--color-accent)]">
                {formatMoney(toMoney(lineTotalInCents))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
