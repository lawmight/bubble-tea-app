import { env } from '@/lib/env';

export interface CheckoutLineItem {
  name: string;
  quantity: number;
  unitPriceInCents: number;
}

export interface CreateCheckoutOptions {
  orderNumber: string;
  items: CheckoutLineItem[];
  taxInCents: number;
  tipInCents: number;
  successUrl: string;
  cancelUrl: string;
}

export function isStripeConfigured(): boolean {
  return !!env.STRIPE_SECRET_KEY;
}

/**
 * Creates a Stripe Checkout session and returns its URL.
 * Returns `null` when Stripe is not configured so the app can
 * fall back to "pay at pickup".
 */
export async function createCheckoutSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: CreateCheckoutOptions,
): Promise<string | null> {
  if (!env.STRIPE_SECRET_KEY) {
    return null;
  }

  // TODO: Initialise Stripe with env.STRIPE_SECRET_KEY and create a
  // real checkout session once the stripe package is added and keys are provisioned.
  //
  // const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  // const session = await stripe.checkout.sessions.create({ ... });
  // return session.url;

  return null;
}
