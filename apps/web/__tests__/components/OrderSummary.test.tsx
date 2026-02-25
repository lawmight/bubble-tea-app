import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { OrderSummary } from '@/components/shop/OrderSummary';

describe('OrderSummary', () => {
  it('renders subtotal, tax, and total', () => {
    render(
      <OrderSummary subtotalInCents={1000} taxInCents={80} totalInCents={1080} />,
    );

    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();
    expect(screen.getByText('Tax')).toBeInTheDocument();
    expect(screen.getByText('$0.80')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$10.80')).toBeInTheDocument();
  });

  it('renders tip when provided', () => {
    render(
      <OrderSummary
        subtotalInCents={1000}
        taxInCents={80}
        tipInCents={200}
        totalInCents={1280}
      />,
    );

    expect(screen.getByText('Tip')).toBeInTheDocument();
    expect(screen.getByText('$2.00')).toBeInTheDocument();
  });

  it('does not render tip when zero', () => {
    render(
      <OrderSummary subtotalInCents={1000} taxInCents={80} totalInCents={1080} />,
    );

    expect(screen.queryByText('Tip')).not.toBeInTheDocument();
  });

  it('renders service fee when provided', () => {
    render(
      <OrderSummary
        subtotalInCents={1000}
        taxInCents={80}
        serviceFeeInCents={50}
        totalInCents={1130}
      />,
    );

    expect(screen.getByText('Service fee')).toBeInTheDocument();
    expect(screen.getByText('$0.50')).toBeInTheDocument();
  });

  it('renders discount with promo code', () => {
    render(
      <OrderSummary
        subtotalInCents={1000}
        taxInCents={80}
        discountInCents={200}
        promoCode="BOBA20"
        totalInCents={880}
      />,
    );

    expect(screen.getByText('Discount (BOBA20)')).toBeInTheDocument();
  });

  it('renders Price Breakdown heading', () => {
    render(
      <OrderSummary subtotalInCents={0} taxInCents={0} totalInCents={0} />,
    );

    expect(screen.getByText('Price Breakdown')).toBeInTheDocument();
  });
});
