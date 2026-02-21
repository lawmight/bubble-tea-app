import type { Metadata } from 'next';

import { CartView } from '@/components/shop/CartView';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review drinks in your cart before checkout.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage(): JSX.Element {
  return <CartView />;
}
