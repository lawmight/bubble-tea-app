import { STORE_HOURS } from '../constants/store-hours';

function parseHourMinute(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(':').map((part) => Number(part));
  return { hour, minute };
}

export function isStoreOpen(now: Date): boolean {
  const hours = STORE_HOURS.find((entry) => entry.day === now.getDay());
  if (!hours) {
    return false;
  }

  const open = parseHourMinute(hours.open);
  const close = parseHourMinute(hours.close);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = open.hour * 60 + open.minute;
  const closeMinutes = close.hour * 60 + close.minute;

  return minutes >= openMinutes && minutes <= closeMinutes;
}

export function estimatePickupTime(orderTime: Date, queueLength: number): Date {
  const averagePrepMinutes = 4;
  const estimatedMinutes = Math.max(8, queueLength * averagePrepMinutes + 6);
  return new Date(orderTime.getTime() + estimatedMinutes * 60_000);
}
