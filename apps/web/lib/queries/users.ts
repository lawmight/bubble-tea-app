import { UserModel } from '@vetea/shared/models/User';
import type { User } from '@vetea/shared';

import { connectDB } from '@/lib/db';

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw._id),
    clerkId: String(raw.clerkId),
    email: String(raw.email),
    name: String(raw.name),
    phone: raw.phone ? String(raw.phone) : undefined,
    defaultSugarLevel: raw.defaultSugarLevel ? String(raw.defaultSugarLevel) : undefined,
    defaultIceLevel: raw.defaultIceLevel ? String(raw.defaultIceLevel) : undefined,
    createdAt: new Date(String(raw.createdAt)),
    updatedAt: new Date(String(raw.updatedAt)),
  };
}

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  await connectDB();
  const user = await UserModel.findOne({ clerkId, deletedAt: { $exists: false } }).lean().exec();
  return user ? normalizeUser(user as Record<string, unknown>) : null;
}
