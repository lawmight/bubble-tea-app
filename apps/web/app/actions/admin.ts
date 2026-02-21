'use server';

import { auth } from '@clerk/nextjs/server';
import { ProductModel } from '@vetea/shared/models/Product';
import { OrderModel } from '@vetea/shared/models/Order';
import { revalidateTag } from 'next/cache';

import { connectDB } from '@/lib/db';
import { log } from '@/lib/logger';

interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

async function requireAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (!userId || role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return userId;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

const VALID_CATEGORIES = ['milk-tea', 'fruit-tea', 'special', 'classic'] as const;
const VALID_ORDER_STATUSES = ['pending', 'preparing', 'ready', 'completed', 'cancelled'] as const;

function parseProductForm(data: FormData) {
  const name = String(data.get('name') ?? '').trim();
  const slug = String(data.get('slug') ?? '').trim() || slugify(name);
  const description = String(data.get('description') ?? '').trim();
  const priceStr = String(data.get('price') ?? '0');
  const basePriceInCents = Math.round(parseFloat(priceStr) * 100);
  const category = String(data.get('category') ?? '') as (typeof VALID_CATEGORIES)[number];
  const image = String(data.get('image') ?? '').trim();
  const available = data.get('available') === 'on' || data.get('available') === 'true';

  if (!name) throw new Error('Name is required');
  if (!slug) throw new Error('Slug is required');
  if (!description) throw new Error('Description is required');
  if (isNaN(basePriceInCents) || basePriceInCents < 0) throw new Error('Valid price is required');
  if (!VALID_CATEGORIES.includes(category)) throw new Error('Valid category is required');
  if (!image) throw new Error('Image URL is required');

  return { name, slug, description, basePriceInCents, category, image, available };
}

export async function createProduct(data: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin();
    await connectDB();

    const fields = parseProductForm(data);

    const existing = await ProductModel.findOne({ slug: fields.slug }).lean().exec();
    if (existing) {
      return { success: false, message: 'A product with this slug already exists.' };
    }

    const doc = await ProductModel.create(fields);
    revalidateTag('products');

    return {
      success: true,
      message: 'Product created successfully.',
      data: { id: String(doc._id) },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create product.';
    log('error', 'createProduct failed', { error });
    return { success: false, message: msg };
  }
}

export async function updateProduct(
  productId: string,
  data: FormData,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    const fields = parseProductForm(data);

    const duplicate = await ProductModel.findOne({
      slug: fields.slug,
      _id: { $ne: productId },
    })
      .lean()
      .exec();
    if (duplicate) {
      return { success: false, message: 'Another product with this slug already exists.' };
    }

    const updated = await ProductModel.findByIdAndUpdate(productId, fields, { new: true }).exec();
    if (!updated) {
      return { success: false, message: 'Product not found.' };
    }

    revalidateTag('products');
    return { success: true, message: 'Product updated successfully.' };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update product.';
    log('error', 'updateProduct failed', { error, productId });
    return { success: false, message: msg };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    const deleted = await ProductModel.findByIdAndDelete(productId).exec();
    if (!deleted) {
      return { success: false, message: 'Product not found.' };
    }

    revalidateTag('products');
    return { success: true, message: 'Product deleted.' };
  } catch (error) {
    log('error', 'deleteProduct failed', { error, productId });
    return { success: false, message: 'Failed to delete product.' };
  }
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed'],
  completed: [],
  cancelled: [],
};

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();

    if (!VALID_ORDER_STATUSES.includes(status as (typeof VALID_ORDER_STATUSES)[number])) {
      return { success: false, message: 'Invalid status.' };
    }

    const order = await OrderModel.findById(orderId).exec();
    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    const currentStatus = order.status as string;
    const allowed = STATUS_TRANSITIONS[currentStatus] ?? [];
    if (!allowed.includes(status)) {
      return {
        success: false,
        message: `Cannot transition from "${currentStatus}" to "${status}".`,
      };
    }

    order.status = status;
    await order.save();

    revalidateTag('orders');
    revalidateTag(`orders-${order.userId}`);
    return { success: true, message: `Order status updated to "${status}".` };
  } catch (error) {
    log('error', 'updateOrderStatus failed', { error, orderId, status });
    return { success: false, message: 'Failed to update order status.' };
  }
}
