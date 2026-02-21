import { model, models, Schema, type InferSchemaType } from 'mongoose';

const counterSchema = new Schema(
  {
    key: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

counterSchema.index({ key: 1, date: 1 }, { unique: true });

export type CounterDocument = InferSchemaType<typeof counterSchema> & {
  _id: Schema.Types.ObjectId;
};

export const CounterModel = models?.Counter ?? model('Counter', counterSchema);
