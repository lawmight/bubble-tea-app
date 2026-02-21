'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { clampQuantity, type Cart, type CartItem } from '@vetea/shared';

const STORAGE_KEY = 'vetea-cart-v1';

function buildMergeKey(item: CartItem): string {
  return [
    item.productId,
    item.selection.size,
    item.selection.sugar,
    item.selection.ice,
    item.selection.toppings.slice().sort().join('|'),
  ].join(':');
}

function persist(items: CartItem[]): void {
  const payload: Cart = { items };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function parseStorage(): CartItem[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value) as Cart;
    if (!Array.isArray(parsed.items)) {
      return [];
    }

    return parsed.items;
  } catch {
    return [];
  }
}

export function useCart(): {
  items: CartItem[];
  count: number;
  announcement: string;
  addItem: (item: CartItem) => void;
  removeItem: (mergeKey: string) => void;
  updateQuantity: (mergeKey: string, quantity: number) => void;
  clearCart: () => void;
  mergeCartItems: (incoming: CartItem[]) => void;
  refreshAvailability: () => Promise<void>;
} {
  const [items, setItems] = useState<CartItem[]>([]);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    setItems(parseStorage());
  }, []);

  useEffect(() => {
    persist(items);
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      const mergeKey = buildMergeKey(item);
      const existing = current.find((entry) => buildMergeKey(entry) === mergeKey);
      if (!existing) {
        setAnnouncement(`${item.name} added to cart.`);
        return [...current, { ...item, quantity: clampQuantity(item.quantity) }];
      }

      const next = current.map((entry) =>
        buildMergeKey(entry) === mergeKey
          ? { ...entry, quantity: clampQuantity(entry.quantity + item.quantity) }
          : entry,
      );

      setAnnouncement(`${item.name} quantity updated.`);
      return next;
    });
  }, []);

  const removeItem = useCallback((mergeKey: string) => {
    setItems((current) => current.filter((entry) => buildMergeKey(entry) !== mergeKey));
    setAnnouncement('Item removed from cart.');
  }, []);

  const updateQuantity = useCallback((mergeKey: string, quantity: number) => {
    setItems((current) =>
      current.map((entry) =>
        buildMergeKey(entry) === mergeKey
          ? { ...entry, quantity: clampQuantity(quantity) }
          : entry,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAnnouncement('Cart cleared.');
  }, []);

  const mergeCartItems = useCallback((incoming: CartItem[]) => {
    setItems((current) => {
      const merged = new Map<string, CartItem>();
      for (const item of [...current, ...incoming]) {
        const key = buildMergeKey(item);
        const existing = merged.get(key);
        if (!existing) {
          merged.set(key, { ...item, quantity: clampQuantity(item.quantity) });
          continue;
        }
        existing.quantity = clampQuantity(existing.quantity + item.quantity);
      }
      return Array.from(merged.values());
    });
    setAnnouncement('Cart merged.');
  }, []);

  const refreshAvailability = useCallback(async () => {
    const response = await fetch('/api/products', { cache: 'no-store' });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as {
      data?: Array<{ id: string; available: boolean; name: string }>;
    };

    if (!payload.data) {
      return;
    }

    const availableIds = new Set(payload.data.filter((item) => item.available).map((item) => item.id));
    const availableNames = new Map(payload.data.map((item) => [item.id, item.name]));

    setItems((current) => {
      const removed: string[] = [];
      const filtered = current.filter((item) => {
        const keep = availableIds.has(item.productId);
        if (!keep) {
          removed.push(availableNames.get(item.productId) ?? item.name);
        }
        return keep;
      });

      if (removed.length > 0) {
        setAnnouncement(`Removed unavailable items: ${Array.from(new Set(removed)).join(', ')}`);
      }

      return filtered;
    });
  }, []);

  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  return {
    items,
    count,
    announcement,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    mergeCartItems,
    refreshAvailability,
  };
}
