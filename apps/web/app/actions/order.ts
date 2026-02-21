'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { OrderModel } from '@vetea/shared/models/Order';
import { ProductModel } from '@vetea/shared/models/Product';
import {
  calculateItemUnitPrice,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  clampQuantity,
  estimatePickupTime,
  placeOrderInputSchema,
  type Order,
  type PlaceOrderInput,
} from '@vetea/shared';
import { revalidateTag } from 'next/cache';

import { connectDB } from '@/lib/db';
import { log } from '@/lib/logger';
import { notifyCustomer, notifyStaff } from '@/lib/notifications/order';
import { getQueueLength } from '@/lib/queries/orders';
import { getNextOrderNumber } from '@/lib/utils/order-number';

interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

interface PersistedProduct {
  _id: unknown;
  name: string;
  available: boolean;
  basePriceInCents: number;
  customizations: Array<{
    type: string;
    options: Array<{ name: string; priceModifierInCents: number; available: boolean }>;
  }>;
}

interface PersistedOrder {
  _id: unknown;
  orderNumber: string;
  idempotencyKey: string;
  userId: string;
  items: Array<{
    productId: unknown;
    name: string;
    size: string;
    sugar: string;
    ice: string;
    toppings: string[];
    quantity: number;
    unitPriceInCents: number;
  }>;
  subtotalInCents: number;
  taxInCents: number;
  taxRate: number;
  tipInCents: number;
  serviceFeeInCents: number;
  totalPriceInCents: number;
  estimatedReadyAt?: Date;
  status: Order['status'];
  createdAt: Date;
  updatedAt: Date;
}

function getCustomizationOptions(
  customizations: Array<{
    type: string;
    options: Array<{ name: string; priceModifierInCents: number; available: boolean }>;
  }>,
  type: string,
): Array<{ name: string; priceModifierInCents: number; available: boolean }> {
  return customizations.find((entry) => entry.type === type)?.options ?? [];
}

export async function placeOrder(
  unsafeInput: PlaceOrderInput,
): Promise<ActionResult<{ orderId: string; orderNumber: string }>> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: 'You must be signed in to place an order.' };
  }

  const parsed = placeOrderInputSchema.safeParse(unsafeInput);
  if (!parsed.success) {
    return { success: false, message: 'Invalid order payload.' };
  }

  const input = parsed.data;

  try {
    await connectDB();

    const existingOrder = (await OrderModel.findOne({
      idempotencyKey: input.idempotencyKey,
      userId,
    })
      .lean()
      .exec()) as Pick<PersistedOrder, '_id' | 'orderNumber'> | null;

    if (existingOrder) {
      return {
        success: true,
        message: 'Order already placed with this request.',
        data: {
          orderId: String(existingOrder._id),
          orderNumber: String(existingOrder.orderNumber),
        },
      };
    }

    const productIds = Array.from(new Set(input.items.map((item) => item.productId)));
    const products = (await ProductModel.find({
      _id: { $in: productIds },
    })
      .lean()
      .exec()) as unknown as PersistedProduct[];

    const productsById = new Map(products.map((product) => [String(product._id), product]));
    const unavailableItems: string[] = [];
    const invalidOptions: string[] = [];

    const orderItems = input.items.map((item) => {
      const product = productsById.get(item.productId);
      if (!product || !product.available) {
        unavailableItems.push(item.name);
        return null;
      }

      const sizeOptions = getCustomizationOptions(product.customizations, 'size');
      const toppingOptions = getCustomizationOptions(product.customizations, 'topping');

      const selectedSize = sizeOptions.find((option) => option.name === item.selection.size);
      if (!selectedSize || !selectedSize.available) {
        invalidOptions.push(`${item.name}: size ${item.selection.size} is unavailable`);
      }

      for (const toppingName of item.selection.toppings) {
        const topping = toppingOptions.find((option) => option.name === toppingName);
        if (!topping || !topping.available) {
          invalidOptions.push(`${item.name}: topping ${toppingName} is unavailable`);
        }
      }

      const unitPriceInCents = calculateItemUnitPrice(
        {
          basePriceInCents: Number(product.basePriceInCents),
          sizeOptions,
          toppingOptions,
        },
        {
          size: item.selection.size,
          toppings: item.selection.toppings,
        },
      );

      return {
        productId: product._id,
        name: product.name,
        size: item.selection.size,
        sugar: item.selection.sugar,
        ice: item.selection.ice,
        toppings: item.selection.toppings,
        quantity: clampQuantity(item.quantity),
        unitPriceInCents,
      };
    });

    if (unavailableItems.length > 0) {
      return {
        success: false,
        message: `Unavailable products: ${Array.from(new Set(unavailableItems)).join(', ')}`,
      };
    }

    if (invalidOptions.length > 0) {
      return {
        success: false,
        message: invalidOptions.join('; '),
      };
    }

    const normalizedItems = orderItems.filter(
      (item): item is NonNullable<typeof item> => item !== null,
    );
    const subtotalInCents = calculateSubtotal(normalizedItems);
    const taxRate = input.taxRate ?? 0.08;
    const taxInCents = calculateTax(subtotalInCents, taxRate);
    const tipInCents = input.tipInCents ?? 0;
    const serviceFeeInCents = input.serviceFeeInCents ?? 0;
    const totalPriceInCents = calculateTotal(
      subtotalInCents,
      taxInCents,
      tipInCents,
      serviceFeeInCents,
    );
    const queueLength = await getQueueLength();
    const estimatedReadyAt = estimatePickupTime(new Date(), queueLength);
    const orderNumber = await getNextOrderNumber();

    const createdOrderDoc = await OrderModel.create({
      orderNumber,
      idempotencyKey: input.idempotencyKey,
      userId,
      items: normalizedItems,
      subtotalInCents,
      taxInCents,
      taxRate,
      tipInCents,
      serviceFeeInCents,
      totalPriceInCents,
      estimatedReadyAt,
      status: 'pending',
    });
    const createdOrder = createdOrderDoc.toObject() as PersistedOrder;

    const clerkUser = await currentUser();
    const customerEmail = clerkUser?.emailAddresses[0]?.emailAddress;

    const orderForEmail: Order = {
      id: String(createdOrder._id),
      orderNumber: createdOrder.orderNumber,
      idempotencyKey: createdOrder.idempotencyKey,
      userId: createdOrder.userId,
      items: createdOrder.items.map((item) => ({
        productId: String(item.productId),
        name: item.name,
        size: item.size,
        sugar: item.sugar,
        ice: item.ice,
        toppings: item.toppings,
        quantity: item.quantity,
        unitPriceInCents: item.unitPriceInCents,
      })),
      subtotalInCents: createdOrder.subtotalInCents,
      taxInCents: createdOrder.taxInCents,
      taxRate: createdOrder.taxRate,
      tipInCents: createdOrder.tipInCents,
      serviceFeeInCents: createdOrder.serviceFeeInCents,
      totalPriceInCents: createdOrder.totalPriceInCents,
      estimatedReadyAt: createdOrder.estimatedReadyAt,
      status: createdOrder.status,
      createdAt: createdOrder.createdAt,
      updatedAt: createdOrder.updatedAt,
    };

    if (process.env.RESEND_API_KEY) {
      try {
        if (customerEmail) {
          await notifyCustomer(orderForEmail, customerEmail);
        }
        await notifyStaff(orderForEmail);
      } catch (e) {
        log('error', 'Failed to send order emails', { error: e, orderNumber: createdOrder.orderNumber });
      }
    }

    revalidateTag('orders');
    revalidateTag(`orders-${userId}`);

    return {
      success: true,
      message: 'Order placed successfully.',
      data: {
        orderId: String(createdOrder._id),
        orderNumber: createdOrder.orderNumber,
      },
    };
  } catch (error) {
    log('error', 'placeOrder failed', { error, userId });
    return { success: false, message: 'Unable to place order. Please try again.' };
  }
}

export async function cancelOrder(orderId: string): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: 'You must be signed in.' };
  }

  try {
    await connectDB();
    const order = await OrderModel.findOne({ _id: orderId, userId }).exec();
    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    if (order.status !== 'pending') {
      return {
        success: false,
        message: 'Only pending orders can be cancelled by customers.',
      };
    }

    order.status = 'cancelled';
    await order.save();

    revalidateTag('orders');
    revalidateTag(`orders-${userId}`);

    return { success: true, message: 'Order cancelled.' };
  } catch (error) {
    log('error', 'cancelOrder failed', { error, orderId, userId });
    return { success: false, message: 'Unable to cancel order.' };
  }
}
