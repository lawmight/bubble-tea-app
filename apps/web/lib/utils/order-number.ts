import { CounterModel } from '@vetea/shared';

export async function getNextOrderNumber(now = new Date()): Promise<string> {
  const date = now.toISOString().slice(0, 10);

  const counter = (await CounterModel.findOneAndUpdate(
    { key: 'dailyOrder', date },
    { $inc: { seq: 1 } },
    { upsert: true, new: true },
  )
    .lean()
    .exec()) as { seq: number } | null;

  const seq = counter?.seq ?? 1;
  return `#A${String(seq).padStart(3, '0')}`;
}
