import { formatMoney, toMoney } from '@vetea/shared/client';

interface OrderSummaryProps {
  subtotalInCents: number;
  taxInCents: number;
  tipInCents?: number;
  serviceFeeInCents?: number;
  totalInCents: number;
}

export function OrderSummary({
  subtotalInCents,
  taxInCents,
  tipInCents = 0,
  serviceFeeInCents = 0,
  totalInCents,
}: OrderSummaryProps): JSX.Element {
  return (
    <section className="rounded-2xl border border-[#D4C5B2] bg-white p-5">
      <h2 className="font-display text-lg text-[#6B5344]">Price Breakdown</h2>
      <dl className="mt-3 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[#8C7B6B]">Subtotal</dt>
          <dd className="text-[#6B5344]">{formatMoney(toMoney(subtotalInCents))}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#8C7B6B]">Tax</dt>
          <dd className="text-[#6B5344]">{formatMoney(toMoney(taxInCents))}</dd>
        </div>
        {tipInCents > 0 ? (
          <div className="flex items-center justify-between">
            <dt className="text-[#8C7B6B]">Tip</dt>
            <dd className="text-[#6B5344]">{formatMoney(toMoney(tipInCents))}</dd>
          </div>
        ) : null}
        {serviceFeeInCents > 0 ? (
          <div className="flex items-center justify-between">
            <dt className="text-[#8C7B6B]">Service fee</dt>
            <dd className="text-[#6B5344]">{formatMoney(toMoney(serviceFeeInCents))}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-t border-[#E8DDD0] pt-3 text-base font-bold">
          <dt className="text-[#6B5344]">Total</dt>
          <dd className="text-[#8B9F82]">{formatMoney(toMoney(totalInCents))}</dd>
        </div>
      </dl>
    </section>
  );
}
