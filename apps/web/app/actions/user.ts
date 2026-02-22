'use server';

import { auth } from '@clerk/nextjs/server';
import { UserModel } from '@vetea/shared/models/User';

import { connectDB } from '@/lib/db';

const SUGAR_OPTIONS = ['0%', '25%', '50%', '75%', '100%'];
const ICE_OPTIONS = ['No Ice', 'Less Ice', 'Normal Ice', 'Extra Ice'];

interface ActionResult {
  success: boolean;
  message: string;
}

export async function updateUserPreferences(
  defaultSugarLevel: string,
  defaultIceLevel: string,
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: 'You must be signed in to update preferences.' };
  }

  if (!SUGAR_OPTIONS.includes(defaultSugarLevel) || !ICE_OPTIONS.includes(defaultIceLevel)) {
    return { success: false, message: 'Invalid preference values.' };
  }

  try {
    await connectDB();

    const result = await UserModel.findOneAndUpdate(
      { clerkId: userId },
      { $set: { defaultSugarLevel, defaultIceLevel } },
      { new: true },
    ).exec();

    if (!result) {
      return { success: false, message: 'User not found. Please try again after signing in.' };
    }

    return { success: true, message: 'Preferences saved.' };
  } catch (err) {
    console.error('updateUserPreferences error:', err);
    return { success: false, message: 'Failed to save preferences. Please try again.' };
  }
}
