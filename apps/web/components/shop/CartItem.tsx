'use client';

import { formatMoney, toMoney, type CartItem as CartItemType } from '@vetea/shared';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

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
  const lineTotal = item.basePriceInCents * item.quantity;

  return (
    <article className="grid grid-cols-[80px_1fr] gap-3 rounded-2xl border border-[#e6dac9] bg-white p-3">
      <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-[#f8f4ed]">
        <Image
          src={item.image}
          alt={`${item.name} in cart`}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-[#2a2a2a]">{item.name}</h3>
          <p className="text-sm font-semibold text-[#245741]">
            {formatMoney(toMoney(lineTotal))}
          </p>
        </div>
        <p className="text-xs text-[#6f5a44]">
          {item.selection.size} · {item.selection.sugar} · {item.selection.ice}
          {item.selection.toppings.length > 0
            ? ` · ${item.selection.toppings.join(', ')}`
            : ''}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="h-9 px-3"
            onClick={onDecrease}
            aria-label={`Decrease quantity for ${item.name}`}
          >
            -
          </Button>
          <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
          <Button
            variant="secondary"
            className="h-9 px-3"
            onClick={onIncrease}
            aria-label={`Increase quantity for ${item.name}`}
          >
            +
          </Button>
          <Button
            variant="ghost"
            className="ml-auto h-9 px-3 text-[#8f3331]"
            onClick={onRemove}
          >
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}
