export type CurrencyCode = 'USD';

export interface Money {
  amountInCents: number;
  currency: CurrencyCode;
}

const formatterCache = new Map<string, Intl.NumberFormat>();

export function formatMoney(money: Money, locale = 'en-US'): string {
  const key = `${money.currency}:${locale}`;
  const formatter =
    formatterCache.get(key) ??
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
    });

  formatterCache.set(key, formatter);

  return formatter.format(money.amountInCents / 100);
}

export function toMoney(amountInCents: number, currency: CurrencyCode = 'USD'): Money {
  return { amountInCents, currency };
}
