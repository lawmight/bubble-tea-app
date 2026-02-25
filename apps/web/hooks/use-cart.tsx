'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';

import { clampQuantity, type Cart, type CartItem } from '@vetea/shared/client';

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
  if (typeof window === 'undefined') return;
  const payload: Cart = { items };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function parseStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
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

export interface CartContextValue {
  items: CartItem[];
  count: number;
  announcement: string;
  addItem: (item: CartItem) => void;
  removeItem: (mergeKey: string) => void;
  updateQuantity: (mergeKey: string, quantity: number) => void;
  clearCart: () => void;
  mergeCartItems: (incoming: CartItem[]) => void;
  refreshAvailability: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }): JSX.Element {
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
      let next: CartItem[];
      if (!existing) {
        next = [...current, { ...item, quantity: clampQuantity(item.quantity) }];
        setAnnouncement(`${item.name} added to cart.`);
      } else {
        next = current.map((entry) =>
          buildMergeKey(entry) === mergeKey
            ? { ...entry, quantity: clampQuantity(entry.quantity + item.quantity) }
            : entry,
        );
        setAnnouncement(`${item.name} quantity updated.`);
      }
      persist(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((mergeKey: string) => {
    setItems((current) => {
      const next = current.filter((entry) => buildMergeKey(entry) !== mergeKey);
      persist(next);
      setAnnouncement('Item removed from cart.');
      toast('Item removed');
      return next;
    });
  }, []);

  const updateQuantity = useCallback((mergeKey: string, quantity: number) => {
    setItems((current) => {
      const next = current.map((entry) =>
        buildMergeKey(entry) === mergeKey
          ? { ...entry, quantity: clampQuantity(quantity) }
          : entry,
      );
      persist(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems(() => {
      persist([]);
      setAnnouncement('Cart cleared.');
      toast('Cart cleared');
      return [];
    });
  }, []);

  const mergeCartItems = useCallback((incoming: CartItem[]) => {
    const toastId = toast.loading('Syncing cart...');
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
      const next = Array.from(merged.values());
      persist(next);
      setAnnouncement('Cart merged.');
      toast.success('Cart synced', { id: toastId });
      return next;
    });
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

      persist(filtered);
      return filtered;
    });
  }, []);

  const count = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      announcement,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      mergeCartItems,
      refreshAvailability,
    }),
    [
      items,
      count,
      announcement,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      mergeCartItems,
      refreshAvailability,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (ctx == null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
