import { z } from 'zod';

import { ORDER_STATUSES } from '../types/order';
import { PRODUCT_CATEGORIES } from '../types/product';

export const customizationOptionSchema = z.object({
  name: z.string().min(1),
  priceModifierInCents: z.number().int().min(0),
  available: z.boolean().default(true),
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  basePriceInCents: z.number().int().min(0),
  category: z.enum(PRODUCT_CATEGORIES),
  image: z.string().min(1),
  available: z.boolean().default(true),
  customizations: z.array(
    z.object({
      type: z.enum(['size', 'sugar', 'ice', 'topping']),
      options: z.array(customizationOptionSchema),
    }),
  ),
});

export const cartItemSelectionSchema = z.object({
  size: z.string().min(1),
  sugar: z.string().min(1),
  ice: z.string().min(1),
  toppings: z.array(z.string().min(1)).max(8),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  productSlug: z.string().min(1),
  name: z.string().min(1),
  image: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
  basePriceInCents: z.number().int().min(0),
  selection: cartItemSelectionSchema,
  addedAt: z.string().datetime(),
});

export const placeOrderInputSchema = z.object({
  idempotencyKey: z.string().uuid(),
  items: z.array(cartItemSchema).min(1).max(25),
  taxRate: z.number().min(0).max(0.2).default(0.08).optional(),
  tipInCents: z.number().int().min(0).max(5_000).default(0).optional(),
  serviceFeeInCents: z.number().int().min(0).max(2_000).default(0).optional(),
});

export const orderSchema = z.object({
  orderNumber: z.string().min(1),
  idempotencyKey: z.string().uuid(),
  userId: z.string().min(1),
  status: z.enum(ORDER_STATUSES),
  subtotalInCents: z.number().int().min(0),
  taxInCents: z.number().int().min(0),
  taxRate: z.number().min(0).max(0.2),
  tipInCents: z.number().int().min(0),
  serviceFeeInCents: z.number().int().min(0),
  totalPriceInCents: z.number().int().min(0),
});

export type PlaceOrderInput = z.infer<typeof placeOrderInputSchema>;
