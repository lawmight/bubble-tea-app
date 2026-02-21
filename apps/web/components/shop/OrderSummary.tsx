import { formatMoney, toMoney } from '@vetea/shared';

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
    <section className="space-y-3 rounded-2xl border border-[#e6dac9] bg-white p-4">
      <h2 className="text-base font-semibold text-[#2a2a2a]">Order summary</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-[#6f5a44]">Subtotal</dt>
          <dd>{formatMoney(toMoney(subtotalInCents))}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-[#6f5a44]">Tax</dt>
          <dd>{formatMoney(toMoney(taxInCents))}</dd>
        </div>
        {tipInCents > 0 ? (
          <div className="flex items-center justify-between">
            <dt className="text-[#6f5a44]">Tip</dt>
            <dd>{formatMoney(toMoney(tipInCents))}</dd>
          </div>
        ) : null}
        {serviceFeeInCents > 0 ? (
          <div className="flex items-center justify-between">
            <dt className="text-[#6f5a44]">Service fee</dt>
            <dd>{formatMoney(toMoney(serviceFeeInCents))}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-t border-[#efe5d8] pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd className="text-[#245741]">{formatMoney(toMoney(totalInCents))}</dd>
        </div>
      </dl>
    </section>
  );
}
