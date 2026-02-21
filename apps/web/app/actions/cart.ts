'use server';

import { auth } from '@clerk/nextjs/server';
import { clampQuantity, type CartItem } from '@vetea/shared';

interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

function buildMergeKey(item: CartItem): string {
  return [
    item.productId,
    item.selection.size,
    item.selection.sugar,
    item.selection.ice,
    item.selection.toppings.slice().sort().join('|'),
  ].join(':');
}

export async function mergeCartOnSignIn(
  localItems: CartItem[],
  serverItems: CartItem[] = [],
): Promise<ActionResult<CartItem[]>> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: 'Unauthorized.' };
  }

  const merged = new Map<string, CartItem>();
  const allItems = [...serverItems, ...localItems];

  for (const item of allItems) {
    const key = buildMergeKey(item);
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, { ...item, quantity: clampQuantity(item.quantity) });
      continue;
    }

    existing.quantity = clampQuantity(existing.quantity + item.quantity);
    existing.addedAt =
      new Date(existing.addedAt).getTime() > new Date(item.addedAt).getTime()
        ? existing.addedAt
        : item.addedAt;
  }

  return {
    success: true,
    message: 'Cart merged successfully.',
    data: Array.from(merged.values()),
  };
}
