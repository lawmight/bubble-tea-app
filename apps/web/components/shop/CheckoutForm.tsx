'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  calculateTax,
  calculateTotal,
  formatMoney,
  isStoreOpen,
  STORE_TIMEZONE,
  toMoney,
} from '@vetea/shared/client';

import { placeOrder } from '@/app/actions/order';
import { OrderSummary } from '@/components/shop/OrderSummary';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/use-cart';

type PaymentMethod = 'pickup' | 'online';

const TAX_RATE = 0.08;
const ORDER_COOLDOWN_MS = 30_000;
const SESSION_KEY_LAST_ORDER = 'vetea_last_order_ts';

const PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.1,
};

function useStoreOpenCheck(): boolean {
  const [open, setOpen] = useState(() => {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: STORE_TIMEZONE }),
    );
    return isStoreOpen(now);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date(
        new Date().toLocaleString('en-US', { timeZone: STORE_TIMEZONE }),
      );
      setOpen(isStoreOpen(now));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return open;
}

function useOrderCooldown(): {
  cooldownRemaining: number;
  startCooldown: () => void;
} {
  const [cooldownRemaining, setCooldownRemaining] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = sessionStorage.getItem(SESSION_KEY_LAST_ORDER);
    if (!stored) return 0;
    const elapsed = Date.now() - Number(stored);
    return elapsed < ORDER_COOLDOWN_MS ? ORDER_COOLDOWN_MS - elapsed : 0;
  });

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      const stored = sessionStorage.getItem(SESSION_KEY_LAST_ORDER);
      if (!stored) {
        setCooldownRemaining(0);
        return;
      }
      const elapsed = Date.now() - Number(stored);
      const remaining = ORDER_COOLDOWN_MS - elapsed;
      setCooldownRemaining(remaining > 0 ? remaining : 0);
    }, 1_000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const startCooldown = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY_LAST_ORDER, String(Date.now()));
    setCooldownRemaining(ORDER_COOLDOWN_MS);
  }, []);

  return { cooldownRemaining, startCooldown };
}

export function CheckoutForm(): JSX.Element {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [tipInCents, setTipInCents] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [pending, setPending] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pickup');

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const stripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const storeIsOpen = useStoreOpenCheck();
  const isClosed = !storeIsOpen;

  const { cooldownRemaining, startCooldown } = useOrderCooldown();
  const cooldownSeconds = Math.ceil(cooldownRemaining / 1_000);

  const subtotalInCents = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + (item.unitPriceInCents ?? item.basePriceInCents) * item.quantity,
        0,
      ),
    [items],
  );

  const discountRate = appliedPromo ? (PROMO_CODES[appliedPromo] ?? 0) : 0;
  const discountInCents = Math.round(subtotalInCents * discountRate);
  const discountedSubtotal = subtotalInCents - discountInCents;

  const taxInCents = calculateTax(discountedSubtotal, TAX_RATE);
  const totalInCents = calculateTotal(discountedSubtotal, taxInCents, tipInCents, 0);

  function applyPromo(): void {
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a promo code.');
      return;
    }
    if (!PROMO_CODES[code]) {
      setPromoError('Invalid promo code.');
      return;
    }
    setAppliedPromo(code);
    setPromoInput('');
  }

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

    if (cooldownRemaining > 0) {
      setErrorMessage(`Please wait ${cooldownSeconds}s before placing another order.`);
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

      startCooldown();
      clearCart();
      setStatusMessage(`Order ${result.data?.orderNumber ?? ''} placed successfully.`);
      router.push(
        `/order-confirmation?orderNumber=${encodeURIComponent(result.data?.orderNumber ?? '')}`,
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-5 pb-6">
      <h1 className="font-display text-2xl text-[#6B5344]">Order Summary</h1>

      {isClosed ? (
        <p role="alert" className="rounded-xl bg-[#fff3cd] px-4 py-3 text-sm text-[#7a5b00]">
          Store is currently closed. Please come back during business hours.
        </p>
      ) : null}

      {/* Cart items */}
      {items.length > 0 && (
        <div className="rounded-2xl border border-[#E8DDD0] bg-white">
          <div className="border-b border-[#E8DDD0] px-4 py-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8C7B6B]">
              Items ({items.reduce((n, i) => n + i.quantity, 0)})
            </h2>
          </div>
          <div className="divide-y divide-[#F5F0E8]">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.selection.size}-${item.selection.toppings.join(',')}`}
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#D4C5B2] bg-[#F5F0E8]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#6B5344]">{item.name}</p>
                  <p className="text-xs text-[#8C7B6B]">
                    {formatMoney(
                      toMoney(item.unitPriceInCents ?? item.basePriceInCents),
                    )}{' '}
                    &times; {item.quantity}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-[#6B5344]">
                  {formatMoney(
                    toMoney(
                      (item.unitPriceInCents ?? item.basePriceInCents) * item.quantity,
                    ),
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tip selector */}
      <fieldset className="space-y-2 rounded-2xl border border-[#E8DDD0] bg-white p-4">
        <legend className="text-sm font-medium text-[#6B5344]">Add a tip</legend>
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
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                tipInCents === tip.value
                  ? 'border-[#8B9F82] bg-[#8B9F82] text-white'
                  : 'border-[#D4C5B2] text-[#6B5344] hover:border-[#8B9F82] hover:text-[#8B9F82]'
              }`}
            >
              {tip.label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Promo code */}
      <div className="space-y-2 rounded-2xl border border-[#E8DDD0] bg-white p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8C7B6B]">
          Promo Code
        </h2>
        {appliedPromo ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#8B9F82]">
              {appliedPromo} applied
            </span>
            <button
              type="button"
              onClick={() => setAppliedPromo(null)}
              className="text-xs font-medium text-[#8C7B6B] underline hover:text-[#6B5344]"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyPromo();
                }
              }}
              className="flex-1"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="shrink-0 rounded-full border border-[#D4C5B2] px-4 py-1.5 text-sm font-medium text-[#6B5344] transition-colors hover:border-[#8B9F82] hover:text-[#8B9F82]"
            >
              Apply
            </button>
          </div>
        )}
        {promoError && (
          <p className="text-xs text-[#8f3331]">{promoError}</p>
        )}
      </div>

      {/* Payment method */}
      <fieldset className="space-y-2 rounded-2xl border border-[#E8DDD0] bg-white p-4">
        <legend className="text-sm font-medium text-[#6B5344]">Payment Method</legend>
        <div className="flex flex-wrap gap-2">
          {(['pickup', 'online'] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                paymentMethod === method
                  ? 'border-[#8B9F82] bg-[#8B9F82] text-white'
                  : 'border-[#D4C5B2] text-[#6B5344] hover:border-[#8B9F82] hover:text-[#8B9F82]'
              }`}
            >
              {method === 'pickup' ? 'Pay at Pickup' : 'Pay Online'}
            </button>
          ))}
        </div>
        {paymentMethod === 'online' && !stripeConfigured && (
          <p className="text-xs text-[#8C7B6B]">
            Online payment coming soon. Please select &ldquo;Pay at Pickup&rdquo; for now.
          </p>
        )}
      </fieldset>

      {/* Price breakdown */}
      <OrderSummary
        subtotalInCents={subtotalInCents}
        taxInCents={taxInCents}
        tipInCents={tipInCents}
        discountInCents={discountInCents}
        promoCode={appliedPromo ?? undefined}
        totalInCents={totalInCents}
      />

      {/* Contact form */}
      <div className="space-y-3 rounded-2xl border border-[#D4C5B2] bg-white p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#8C7B6B]">
          Pickup Details
        </h2>
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-[#6B5344]">
            Name:
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            aria-describedby={errorMessage ? 'checkout-error' : undefined}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-[#6B5344]">
            Phone:
          </label>
          <Input
            id="phone"
            name="phone"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            aria-describedby={errorMessage ? 'checkout-error' : undefined}
          />
        </div>
        <p className="pt-1 text-xs text-[#8C7B6B]">
          {paymentMethod === 'online' && stripeConfigured
            ? 'You will be redirected to complete payment.'
            : 'Pay in person on pickup.'}
        </p>
      </div>

      {/* Error / status messages */}
      {errorMessage ? (
        <p
          id="checkout-error"
          role="alert"
          className="rounded-xl bg-[#fde8e8] px-4 py-3 text-sm text-[#8f3331]"
        >
          {errorMessage}
        </p>
      ) : null}
      {statusMessage ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl bg-[#e7f5ee] px-4 py-3 text-sm text-[#245741]"
        >
          {statusMessage}
        </p>
      ) : null}

      {/* Estimated pickup notice */}
      <div className="flex items-center justify-center gap-1.5 text-sm text-[#8B9F82]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="#8B9F82" strokeWidth="2" />
          <path d="M12 6v6l4 2" stroke="#8B9F82" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="font-medium">Estimated pickup: 10-15 min</span>
      </div>

      {/* Place Order CTA */}
      <button
        type="button"
        disabled={pending || isClosed || cooldownRemaining > 0 || (paymentMethod === 'online' && !stripeConfigured)}
        onClick={() => void submitOrder()}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8B9F82] text-sm font-bold text-white transition-colors hover:bg-[#7A8E72] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {pending
          ? 'Placing order...'
          : cooldownRemaining > 0
            ? `Wait ${cooldownSeconds}s...`
            : `Place Order (${formatMoney(toMoney(totalInCents))})`}
      </button>
    </section>
  );
}
