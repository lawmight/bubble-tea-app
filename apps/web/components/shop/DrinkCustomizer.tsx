'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { calculateItemUnitPrice, formatMoney, toMoney, type Product } from '@vetea/shared';

import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';

interface DrinkCustomizerProps {
  product: Product;
}

function getDefaultOption(
  product: Product,
  type: 'size' | 'sugar' | 'ice',
): string {
  const options = product.customizations.find((entry) => entry.type === type)?.options ?? [];
  return options.find((option) => option.available)?.name ?? '';
}

export function DrinkCustomizer({ product }: DrinkCustomizerProps): JSX.Element {
  const router = useRouter();
  const { addItem } = useCart();

  const [size, setSize] = useState(() => getDefaultOption(product, 'size'));
  const [sugar, setSugar] = useState(() => getDefaultOption(product, 'sugar'));
  const [ice, setIce] = useState(() => getDefaultOption(product, 'ice'));
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

  return (
    <section className="space-y-4 rounded-2xl border border-[#e6dac9] bg-white p-4">
      <h2 className="text-lg font-semibold text-[#2a2a2a]">Customize your drink</h2>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[#5b4632]">Size</legend>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              disabled={!option.available}
              onClick={() => setSize(option.name)}
              className={`rounded-full border px-3 py-1 text-sm ${
                size === option.name
                  ? 'border-[#245741] bg-[#245741] text-white'
                  : 'border-[#d8c7b0] text-[#5b4632]'
              } ${option.available ? '' : 'cursor-not-allowed opacity-50'}`}
            >
              {option.name}
              {!option.available ? ' (Sold out)' : ''}
            </button>
          ))}
        </div>
      </fieldset>

      {(['sugar', 'ice'] as const).map((type) => {
        const options = product.customizations.find((entry) => entry.type === type)?.options ?? [];
        const selected = type === 'sugar' ? sugar : ice;
        const onSelect = type === 'sugar' ? setSugar : setIce;

        return (
          <fieldset key={type} className="space-y-2">
            <legend className="text-sm font-medium capitalize text-[#5b4632]">{type}</legend>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  disabled={!option.available}
                  onClick={() => onSelect(option.name)}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    selected === option.name
                      ? 'border-[#245741] bg-[#245741] text-white'
                      : 'border-[#d8c7b0] text-[#5b4632]'
                  } ${option.available ? '' : 'cursor-not-allowed opacity-50'}`}
                >
                  {option.name}
                  {!option.available ? ' (Sold out)' : ''}
                </button>
              ))}
            </div>
          </fieldset>
        );
      })}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[#5b4632]">Toppings</legend>
        <div className="flex flex-wrap gap-2">
          {toppingOptions.map((option) => {
            const active = toppings.includes(option.name);
            return (
              <button
                key={option.name}
                type="button"
                disabled={!option.available}
                onClick={() =>
                  setToppings((current) =>
                    current.includes(option.name)
                      ? current.filter((entry) => entry !== option.name)
                      : [...current, option.name],
                  )
                }
                className={`rounded-full border px-3 py-1 text-sm ${
                  active
                    ? 'border-[#245741] bg-[#245741] text-white'
                    : 'border-[#d8c7b0] text-[#5b4632]'
                } ${option.available ? '' : 'cursor-not-allowed opacity-50'}`}
              >
                {option.name}
                {!option.available ? ' (Sold out)' : ''}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8f4ed] p-3">
        <p className="text-sm text-[#5b4632]">
          Current price:{' '}
          <span className="font-semibold text-[#245741]">
            {formatMoney(toMoney(currentPrice))}
          </span>
        </p>
        <Button
          onClick={() => {
            addItem({
              productId: product.id,
              productSlug: product.slug,
              name: product.name,
              image: product.image,
              quantity: 1,
              basePriceInCents: product.basePriceInCents,
              selection: {
                size,
                sugar,
                ice,
                toppings,
              },
              addedAt: new Date().toISOString(),
            });
            router.push('/cart');
          }}
        >
          Add to cart
        </Button>
      </div>
    </section>
  );
}
