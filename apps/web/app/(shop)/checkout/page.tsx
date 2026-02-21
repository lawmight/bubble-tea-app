import type { Metadata } from 'next';

import { auth } from '@clerk/nextjs/server';

import { CheckoutForm } from '@/components/shop/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Confirm your bubble tea order.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage(): Promise<JSX.Element> {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  return <CheckoutForm />;
}
