import { model, models, Schema, type InferSchemaType } from 'mongoose';

const customizationOptionSchema = new Schema(
  {
    name: { type: String, required: true },
    priceModifierInCents: { type: Number, required: true, min: 0, default: 0 },
    available: { type: Boolean, default: true },
  },
  { _id: false },
);

const productCustomizationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['size', 'sugar', 'ice', 'topping'],
      required: true,
    },
    options: { type: [customizationOptionSchema], default: [] },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    basePriceInCents: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['milk-tea', 'fruit-tea', 'special', 'classic'],
      required: true,
    },
    image: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true },
    customizations: { type: [productCustomizationSchema], default: [] },
  },
  { timestamps: true },
);

productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, available: 1 });
productSchema.index({ available: 1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Schema.Types.ObjectId;
};

export const ProductModel = models.Product || model('Product', productSchema);
