import { model, models, Schema, type InferSchemaType } from 'mongoose';

const webhookEventSchema = new Schema(
  {
    eventId: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    processedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: false },
);

export type WebhookEventDocument = InferSchemaType<typeof webhookEventSchema> & {
  _id: Schema.Types.ObjectId;
};

export const WebhookEventModel =
  models.WebhookEvent || model('WebhookEvent', webhookEventSchema);
