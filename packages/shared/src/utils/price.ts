import type { CustomizationOption } from '../types/product';

export interface PriceSelection {
  size: string;
  toppings: string[];
}

export interface PriceSource {
  basePriceInCents: number;
  sizeOptions: CustomizationOption[];
  toppingOptions: CustomizationOption[];
}

export function calculateItemUnitPrice(
  source: PriceSource,
  selection: PriceSelection,
): number {
  const sizeModifier =
    source.sizeOptions.find((option) => option.name === selection.size)?.priceModifierInCents ?? 0;
  const toppingModifier = selection.toppings.reduce((total, topping) => {
    const toppingOption = source.toppingOptions.find((option) => option.name === topping);
    return total + (toppingOption?.priceModifierInCents ?? 0);
  }, 0);

  return source.basePriceInCents + sizeModifier + toppingModifier;
}

export function calculateSubtotal(
  items: Array<{ unitPriceInCents: number; quantity: number }>,
): number {
  return items.reduce((total, item) => total + item.unitPriceInCents * item.quantity, 0);
}

export function calculateTax(subtotalInCents: number, taxRate: number): number {
  return Math.round(subtotalInCents * taxRate);
}

export function calculateTotal(
  subtotalInCents: number,
  taxInCents: number,
  tipInCents = 0,
  serviceFeeInCents = 0,
): number {
  return subtotalInCents + taxInCents + tipInCents + serviceFeeInCents;
}

export function clampQuantity(quantity: number, min = 1, max = 10): number {
  return Math.min(max, Math.max(min, quantity));
}
