import { model, models, Schema, type InferSchemaType } from 'mongoose';

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    sugar: { type: String, required: true },
    ice: { type: String, required: true },
    toppings: { type: [String], default: [] },
    quantity: { type: Number, min: 1, max: 10, required: true },
    unitPriceInCents: { type: Number, min: 0, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, trim: true },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    subtotalInCents: { type: Number, min: 0, required: true },
    taxInCents: { type: Number, min: 0, required: true },
    taxRate: { type: Number, min: 0, max: 1, required: true },
    tipInCents: { type: Number, min: 0, default: 0 },
    serviceFeeInCents: { type: Number, min: 0, default: 0 },
    totalPriceInCents: { type: Number, min: 0, required: true },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    estimatedReadyAt: { type: Date },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true });

export type OrderDocument = InferSchemaType<typeof orderSchema> & {
  _id: Schema.Types.ObjectId;
};

export const OrderModel = models.Order || model('Order', orderSchema);
