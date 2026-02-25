import { describe, expect, it } from 'vitest';

import { formatMoney, toMoney } from './currency';

describe('toMoney', () => {
  it('creates a Money object with USD default', () => {
    expect(toMoney(500)).toEqual({ amountInCents: 500, currency: 'USD' });
  });

  it('creates a Money object with explicit currency', () => {
    expect(toMoney(1200, 'USD')).toEqual({ amountInCents: 1200, currency: 'USD' });
  });

  it('handles zero cents', () => {
    expect(toMoney(0)).toEqual({ amountInCents: 0, currency: 'USD' });
  });

  it('handles negative amounts', () => {
    expect(toMoney(-350)).toEqual({ amountInCents: -350, currency: 'USD' });
  });
});

describe('formatMoney', () => {
  it('formats $5.00', () => {
    expect(formatMoney(toMoney(500))).toBe('$5.00');
  });

  it('formats $0.00', () => {
    expect(formatMoney(toMoney(0))).toBe('$0.00');
  });

  it('formats cents-only amounts', () => {
    expect(formatMoney(toMoney(75))).toBe('$0.75');
  });

  it('formats large amounts', () => {
    expect(formatMoney(toMoney(12345))).toBe('$123.45');
  });

  it('formats negative amounts', () => {
    expect(formatMoney(toMoney(-350))).toBe('-$3.50');
  });

  it('formats with custom locale', () => {
    const result = formatMoney(toMoney(1050), 'en-US');
    expect(result).toBe('$10.50');
  });
});
