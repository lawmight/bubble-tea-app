'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { calculateItemUnitPrice, formatMoney, toMoney, type Product } from '@vetea/shared/client';

import { useCart } from '@/hooks/use-cart';

interface DrinkCustomizerProps {
  product: Product;
  defaultSugar?: string;
  defaultIce?: string;
}

function getDefaultOption(
  product: Product,
  type: 'size' | 'sugar' | 'ice',
): string {
  const options = product.customizations.find((entry) => entry.type === type)?.options ?? [];
  return options.find((option) => option.available)?.name ?? '';
}

function resolveInitial(
  product: Product,
  type: 'sugar' | 'ice',
  preferred?: string,
): string {
  const options = product.customizations.find((entry) => entry.type === type)?.options ?? [];
  const availableNames = options.filter((o) => o.available).map((o) => o.name);
  if (preferred && availableNames.includes(preferred)) return preferred;
  return availableNames[0] ?? '';
}

export function DrinkCustomizer({
  product,
  defaultSugar,
  defaultIce,
}: DrinkCustomizerProps): JSX.Element {
  const router = useRouter();
  const { addItem } = useCart();

  const [size, setSize] = useState(() => getDefaultOption(product, 'size'));
  const [sugar, setSugar] = useState(() =>
    resolveInitial(product, 'sugar', defaultSugar),
  );
  const [ice, setIce] = useState(() => resolveInitial(product, 'ice', defaultIce));
  const [toppings, setToppings] = useState<string[]>([]);

  const sizeOptions = useMemo(
    () => product.customizations.find((entry) => entry.type === 'size')?.options ?? [],
    [product.customizations],
  );
  const toppingOptions = useMemo(
    () => product.customizations.find((entry) => entry.type === 'topping')?.options ?? [],
    [product.customizations],
  );

  const currentPrice = useMemo(
    () =>
      calculateItemUnitPrice(
        {
          basePriceInCents: product.basePriceInCents,
          sizeOptions,
          toppingOptions,
        },
        { size, toppings },
      ),
    [product.basePriceInCents, size, sizeOptions, toppingOptions, toppings],
  );

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (isAdding) return;
    setIsAdding(true);

    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      image: product.image,
      quantity: 1,
      basePriceInCents: product.basePriceInCents,
      unitPriceInCents: currentPrice,
      selection: {
        size,
        sugar,
        ice,
        toppings,
      },
      addedAt: new Date().toISOString(),
    });

    toast.success('Added to cart', { description: product.name });

    setTimeout(() => {
      router.push('/cart');
    }, 600);
  };

  return (
    <>
      <div className="mt-6">
        <fieldset className="space-y-3 pb-6">
          <legend className="text-sm font-semibold text-[var(--color-accent)]">Size</legend>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((option) => {
              const isSelected = size === option.name;
              return (
                <button
                  key={option.name}
                  type="button"
                  disabled={!option.available}
                  onClick={() => setSize(option.name)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-border)] text-[var(--color-accent)]'
                  } ${!option.available ? 'cursor-not-allowed opacity-40' : ''}`}
                >
                  {option.name}
                  {option.priceModifierInCents > 0
                    ? ` +${formatMoney(toMoney(option.priceModifierInCents))}`
                    : ''}
                  {!option.available ? ' (Sold out)' : ''}
                </button>
              );
            })}
          </div>
        </fieldset>

        {(['sugar', 'ice'] as const).map((type) => {
          const options =
            product.customizations.find((entry) => entry.type === type)?.options ?? [];
          const selected = type === 'sugar' ? sugar : ice;
          const onSelect = type === 'sugar' ? setSugar : setIce;

          return (
            <fieldset key={type} className="space-y-3 border-t border-[var(--color-border-card)] py-6">
              <legend className="text-sm font-semibold capitalize text-[var(--color-accent)]">
                {type}
              </legend>
              <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                  const isSelected = selected === option.name;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      disabled={!option.available}
                      onClick={() => onSelect(option.name)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        isSelected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-border)] text-[var(--color-accent)]'
                      } ${!option.available ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      {option.name}
                      {!option.available ? ' (Sold out)' : ''}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        <fieldset className="space-y-3 border-t border-[var(--color-border-card)] pt-6">
          <legend className="text-sm font-semibold text-[var(--color-accent)]">Toppings</legend>
          <div className="space-y-3">
            {toppingOptions.map((option) => {
              const active = toppings.includes(option.name);
              return (
                <button
                  key={option.name}
                  type="button"
                  role="checkbox"
                  aria-checked={active}
                  disabled={!option.available}
                  onClick={() =>
                    setToppings((current) =>
                      current.includes(option.name)
                        ? current.filter((entry) => entry !== option.name)
                        : [...current, option.name],
                    )
                  }
                  className={`flex w-full items-center gap-3 text-left ${
                    !option.available ? 'cursor-not-allowed opacity-40' : ''
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                      active
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    {active && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.5 6L5 8.5L9.5 3.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-[var(--color-accent)]">{option.name}</span>
                  {option.priceModifierInCents > 0 && (
                    <span className="ml-auto text-xs text-[var(--color-text-secondary)]">
                      +{formatMoney(toMoney(option.priceModifierInCents))}
                    </span>
                  )}
                  {!option.available && (
                    <span className="ml-auto text-xs text-[var(--color-text-secondary)]">
                      (Sold out)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div
        className="sticky z-20 -mx-4 mt-8"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0.25rem) + 3.5rem)' }}
      >
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full rounded-t-2xl py-4 text-center text-base font-semibold text-white shadow-[0_-8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ${
            isAdding
              ? 'bg-green-600'
              : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-hover)]'
          }`}
        >
          {isAdding ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-scale-in" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 10l4 4L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Added!
            </span>
          ) : (
            <>Add to Cart &mdash; 1&times; {formatMoney(toMoney(currentPrice))}</>
          )}
        </button>
      </div>
    </>
  );
}
