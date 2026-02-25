import { describe, expect, it } from 'vitest';

import { estimatePickupTime, isStoreOpen } from './time';

describe('estimatePickupTime', () => {
  const baseTime = new Date('2025-03-10T12:00:00Z');

  it('returns at least 8 minutes even with zero queue', () => {
    const result = estimatePickupTime(baseTime, 0);
    const diffMinutes = (result.getTime() - baseTime.getTime()) / 60_000;
    expect(diffMinutes).toBe(8);
  });

  it('adds 4 minutes per queued order plus 6 minutes base', () => {
    const result = estimatePickupTime(baseTime, 3);
    const diffMinutes = (result.getTime() - baseTime.getTime()) / 60_000;
    // 3 * 4 + 6 = 18
    expect(diffMinutes).toBe(18);
  });

  it('uses the 8-minute floor when calculated time is lower', () => {
    // 1 * 4 + 6 = 10, which is > 8, so no floor
    const result1 = estimatePickupTime(baseTime, 1);
    expect((result1.getTime() - baseTime.getTime()) / 60_000).toBe(10);

    // 0 * 4 + 6 = 6, which is < 8, so floor kicks in
    const result0 = estimatePickupTime(baseTime, 0);
    expect((result0.getTime() - baseTime.getTime()) / 60_000).toBe(8);
  });

  it('handles large queue lengths', () => {
    const result = estimatePickupTime(baseTime, 50);
    const diffMinutes = (result.getTime() - baseTime.getTime()) / 60_000;
    // 50 * 4 + 6 = 206
    expect(diffMinutes).toBe(206);
  });

  it('returns a Date object', () => {
    const result = estimatePickupTime(baseTime, 2);
    expect(result).toBeInstanceOf(Date);
  });
});

describe('isStoreOpen', () => {
  it('returns true during store hours on a weekday', () => {
    // Monday at 12:00 (day=1, open 10:00–20:00)
    const monday = new Date('2025-03-10T12:00:00');
    expect(isStoreOpen(monday)).toBe(true);
  });

  it('returns false before opening', () => {
    // Monday at 08:00
    const early = new Date('2025-03-10T08:00:00');
    expect(isStoreOpen(early)).toBe(false);
  });

  it('returns false after closing', () => {
    // Monday at 21:00 (closes at 20:00)
    const late = new Date('2025-03-10T21:00:00');
    expect(isStoreOpen(late)).toBe(false);
  });

  it('returns true at exactly opening time', () => {
    const opening = new Date('2025-03-10T10:00:00');
    expect(isStoreOpen(opening)).toBe(true);
  });

  it('returns true at exactly closing time', () => {
    // Monday closes at 20:00
    const closing = new Date('2025-03-10T20:00:00');
    expect(isStoreOpen(closing)).toBe(true);
  });
});
