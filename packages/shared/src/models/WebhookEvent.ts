import { model, models, Schema, type InferSchemaType } from 'mongoose';

const webhookEventSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true },
    processedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

webhookEventSchema.index({ eventId: 1 }, { unique: true });

export type WebhookEventDocument = InferSchemaType<typeof webhookEventSchema> & {
  _id: Schema.Types.ObjectId;
};

export const WebhookEventModel =
  models.WebhookEvent || model('WebhookEvent', webhookEventSchema);
