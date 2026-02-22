'use client';

import { formatMoney, toMoney, type CartItem as CartItemType } from '@vetea/shared/client';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}

export function CartItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: CartItemProps): JSX.Element {
  const unitPrice = item.unitPriceInCents ?? item.basePriceInCents;
  const isLastItem = item.quantity <= 1;

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

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white p-3">
      {/* Swipe hint (mobile only, fades out) */}
      <div className="animate-swipe-hint pointer-events-none absolute right-3 top-1.5 flex items-center gap-1 text-[10px] text-[#8C7B6B] sm:hidden" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12l5-5M5 12l5 5" stroke="#8C7B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Swipe to remove
      </div>

      <div className="grid grid-cols-[80px_1fr] gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-[#D4C5B2] bg-[#F5F0E8]">
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
            <h3 className="truncate text-base font-bold leading-tight text-[#6B5344]">{item.name}</h3>
            <p className="mt-0.5 truncate text-xs text-[#8C7B6B]">{optionsSummary}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDecrease}
                aria-label={
                  isLastItem ? `Remove ${item.name} from cart` : `Decrease quantity for ${item.name}`
                }
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8B9F82] bg-white text-base font-medium text-[#8B9F82] transition-colors hover:bg-[#8B9F82]/10 active:bg-[#8B9F82]/20"
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm font-bold text-[#6B5344]">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={onIncrease}
                aria-label={`Increase quantity for ${item.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#8B9F82] bg-white text-base font-medium text-[#8B9F82] transition-colors hover:bg-[#8B9F82]/10 active:bg-[#8B9F82]/20"
              >
                +
              </button>
            </div>

            {/* Line total */}
            <p className="text-sm font-bold text-[#6B5344]">
              {formatMoney(toMoney(lineTotalInCents))}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
