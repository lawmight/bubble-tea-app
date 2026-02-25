import { describe, expect, it } from 'vitest';

import {
  calculateItemUnitPrice,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  clampQuantity,
} from '@vetea/shared/client';
import type { PriceSelection, PriceSource } from '@vetea/shared/client';

const source: PriceSource = {
  basePriceInCents: 600,
  sizeOptions: [
    { name: 'Small', priceModifierInCents: -50, available: true },
    { name: 'Medium', priceModifierInCents: 0, available: true },
    { name: 'Large', priceModifierInCents: 100, available: true },
  ],
  toppingOptions: [
    { name: 'Boba', priceModifierInCents: 75, available: true },
    { name: 'Jelly', priceModifierInCents: 75, available: true },
    { name: 'Pudding', priceModifierInCents: 100, available: true },
  ],
};

describe('calculateItemUnitPrice', () => {
  it('returns base price with medium size and no toppings', () => {
    const selection: PriceSelection = { size: 'Medium', toppings: [] };
    expect(calculateItemUnitPrice(source, selection)).toBe(600);
  });

  it('applies size modifier', () => {
    const selection: PriceSelection = { size: 'Large', toppings: [] };
    expect(calculateItemUnitPrice(source, selection)).toBe(700);
  });

  it('applies negative size modifier', () => {
    const selection: PriceSelection = { size: 'Small', toppings: [] };
    expect(calculateItemUnitPrice(source, selection)).toBe(550);
  });

  it('adds single topping', () => {
    const selection: PriceSelection = { size: 'Medium', toppings: ['Boba'] };
    expect(calculateItemUnitPrice(source, selection)).toBe(675);
  });

  it('adds multiple toppings', () => {
    const selection: PriceSelection = { size: 'Medium', toppings: ['Boba', 'Jelly', 'Pudding'] };
    // 600 + 0 + 75 + 75 + 100 = 850
    expect(calculateItemUnitPrice(source, selection)).toBe(850);
  });

  it('ignores unknown toppings gracefully', () => {
    const selection: PriceSelection = { size: 'Medium', toppings: ['NonExistent'] };
    expect(calculateItemUnitPrice(source, selection)).toBe(600);
  });

  it('ignores unknown size gracefully', () => {
    const selection: PriceSelection = { size: 'XL', toppings: [] };
    expect(calculateItemUnitPrice(source, selection)).toBe(600);
  });

  it('combines large size with multiple toppings', () => {
    const selection: PriceSelection = { size: 'Large', toppings: ['Boba', 'Pudding'] };
    // 600 + 100 + 75 + 100 = 875
    expect(calculateItemUnitPrice(source, selection)).toBe(875);
  });
});

describe('calculateSubtotal', () => {
  it('returns 0 for empty items', () => {
    expect(calculateSubtotal([])).toBe(0);
  });

  it('calculates subtotal for a single item', () => {
    expect(calculateSubtotal([{ unitPriceInCents: 600, quantity: 1 }])).toBe(600);
  });

  it('multiplies by quantity', () => {
    expect(calculateSubtotal([{ unitPriceInCents: 600, quantity: 3 }])).toBe(1800);
  });

  it('sums multiple items', () => {
    const items = [
      { unitPriceInCents: 600, quantity: 2 },
      { unitPriceInCents: 850, quantity: 1 },
    ];
    // 1200 + 850 = 2050
    expect(calculateSubtotal(items)).toBe(2050);
  });

  it('handles large quantities', () => {
    expect(calculateSubtotal([{ unitPriceInCents: 500, quantity: 100 }])).toBe(50000);
  });
});

describe('calculateTax', () => {
  it('calculates 8% tax', () => {
    expect(calculateTax(1000, 0.08)).toBe(80);
  });

  it('rounds to nearest cent', () => {
    expect(calculateTax(999, 0.08)).toBe(80); // 79.92 -> 80
  });

  it('returns 0 for zero subtotal', () => {
    expect(calculateTax(0, 0.08)).toBe(0);
  });

  it('handles high tax rate', () => {
    expect(calculateTax(1000, 0.10)).toBe(100);
  });
});

describe('calculateTotal', () => {
  it('sums subtotal and tax', () => {
    expect(calculateTotal(1000, 80)).toBe(1080);
  });

  it('includes tip and service fee', () => {
    expect(calculateTotal(1000, 80, 150, 50)).toBe(1280);
  });

  it('defaults tip and service fee to 0', () => {
    expect(calculateTotal(1000, 80)).toBe(1080);
  });

  it('handles zero values', () => {
    expect(calculateTotal(0, 0, 0, 0)).toBe(0);
  });
});

describe('clampQuantity', () => {
  it('returns value within default range', () => {
    expect(clampQuantity(5)).toBe(5);
  });

  it('clamps below minimum', () => {
    expect(clampQuantity(0)).toBe(1);
  });

  it('clamps above maximum', () => {
    expect(clampQuantity(15)).toBe(10);
  });

  it('returns minimum boundary', () => {
    expect(clampQuantity(1)).toBe(1);
  });

  it('returns maximum boundary', () => {
    expect(clampQuantity(10)).toBe(10);
  });

  it('accepts custom range', () => {
    expect(clampQuantity(3, 5, 20)).toBe(5);
    expect(clampQuantity(25, 5, 20)).toBe(20);
  });
});
