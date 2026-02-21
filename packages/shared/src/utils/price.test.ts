import { describe, expect, it } from 'vitest';

import { calculateTax, calculateTotal } from './price';

describe('price utils', () => {
  it('calculates tax in cents', () => {
    expect(calculateTax(1000, 0.08)).toBe(80);
  });

  it('calculates total with optional fees', () => {
    expect(calculateTotal(1000, 80, 150, 50)).toBe(1280);
  });
});
