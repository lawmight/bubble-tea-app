import { model, models, Schema, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: false, trim: true },
    deletedAt: { type: Date, required: false },
  },
  { timestamps: true },
);

userSchema.index({ clerkId: 1 }, { unique: true });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Schema.Types.ObjectId;
};

export const UserModel = models.User || model('User', userSchema);
