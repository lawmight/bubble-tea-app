export const ORDER_STATUSES = [
  'pending',
  'preparing',
  'ready',
  'completed',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  sugar: string;
  ice: string;
  toppings: string[];
  quantity: number;
  unitPriceInCents: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  idempotencyKey: string;
  userId: string;
  items: OrderItem[];
  subtotalInCents: number;
  taxInCents: number;
  taxRate: number;
  tipInCents: number;
  serviceFeeInCents: number;
  totalPriceInCents: number;
  estimatedReadyAt?: Date;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
