'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { calculateTax, calculateTotal, formatMoney, toMoney } from '@vetea/shared';

import { placeOrder } from '@/app/actions/order';
import { OrderSummary } from '@/components/shop/OrderSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';

const TAX_RATE = 0.08;

export function CheckoutForm(): JSX.Element {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [tipInCents, setTipInCents] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pending, setPending] = useState(false);

  const subtotalInCents = useMemo(
    () => items.reduce((total, item) => total + item.basePriceInCents * item.quantity, 0),
    [items],
  );
  const taxInCents = calculateTax(subtotalInCents, TAX_RATE);
  const totalInCents = calculateTotal(subtotalInCents, taxInCents, tipInCents, 0);
  const isClosed = false;

  async function submitOrder(): Promise<void> {
    setErrorMessage('');
    setStatusMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setPending(true);

    try {
      const result = await placeOrder({
        idempotencyKey: crypto.randomUUID(),
        items,
        taxRate: TAX_RATE,
        tipInCents,
        serviceFeeInCents: 0,
      });

      if (!result.success) {
        setErrorMessage(result.message);
        return;
      }

      clearCart();
      setStatusMessage(`Order ${result.data?.orderNumber ?? ''} placed successfully.`);
      router.push('/orders');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[#2a2a2a]">Checkout</h1>
        <p className="text-sm text-[#6f5a44]">
          Review your details before placing your order.
        </p>
      </header>

      {isClosed ? (
        <p role="alert" className="rounded-xl bg-[#fff3cd] px-4 py-3 text-sm text-[#7a5b00]">
          Store is currently closed. Please come back during business hours.
        </p>
      ) : null}

      <div className="space-y-3 rounded-2xl border border-[#e6dac9] bg-white p-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-[#5b4632]">
            Full name
          </label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            aria-describedby={errorMessage ? 'checkout-error' : undefined}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium text-[#5b4632]">
            Phone number
          </label>
          <Input
            id="phone"
            name="phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            aria-describedby={errorMessage ? 'checkout-error' : undefined}
          />
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-[#5b4632]">Tip</legend>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'No tip', value: 0 },
              { label: '10%', value: Math.round(subtotalInCents * 0.1) },
              { label: '15%', value: Math.round(subtotalInCents * 0.15) },
              { label: '20%', value: Math.round(subtotalInCents * 0.2) },
            ].map((tip) => (
              <button
                key={tip.label}
                type="button"
                onClick={() => setTipInCents(tip.value)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  tipInCents === tip.value
                    ? 'border-[#245741] bg-[#245741] text-white'
                    : 'border-[#d8c7b0] text-[#5b4632]'
                }`}
              >
                {tip.label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {errorMessage ? (
        <p id="checkout-error" role="alert" className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#8f3331]">
          {errorMessage}
        </p>
      ) : null}
      {statusMessage ? (
        <p role="status" aria-live="polite" className="rounded-xl bg-[#e7f5ee] px-4 py-3 text-sm text-[#245741]">
          {statusMessage}
        </p>
      ) : null}

      <OrderSummary
        subtotalInCents={subtotalInCents}
        taxInCents={taxInCents}
        tipInCents={tipInCents}
        totalInCents={totalInCents}
      />

      <Button disabled={pending || isClosed} className="w-full" onClick={() => void submitOrder()}>
        {pending ? 'Placing order...' : `Place order (${formatMoney(toMoney(totalInCents))})`}
      </Button>
    </section>
  );
}
