export interface StoreHour {
  day: number;
  open: string;
  close: string;
}

export const STORE_TIMEZONE = 'America/Los_Angeles';

export const STORE_HOURS: StoreHour[] = [
  { day: 0, open: '10:00', close: '19:00' },
  { day: 1, open: '10:00', close: '20:00' },
  { day: 2, open: '10:00', close: '20:00' },
  { day: 3, open: '10:00', close: '20:00' },
  { day: 4, open: '10:00', close: '21:00' },
  { day: 5, open: '10:00', close: '21:00' },
  { day: 6, open: '10:00', close: '20:00' },
];
