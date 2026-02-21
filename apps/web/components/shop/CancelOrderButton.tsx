'use client';

import { useState, useTransition } from 'react';

import { cancelOrder } from '@/app/actions/order';
import { Button } from '@/components/ui/button';

interface CancelOrderButtonProps {
  orderId: string;
}

export function CancelOrderButton({ orderId }: CancelOrderButtonProps): JSX.Element {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-1">
      <Button
        variant="danger"
        className="h-8 px-3 text-xs"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await cancelOrder(orderId);
            setMessage(result.message);
          })
        }
      >
        {pending ? 'Cancelling\u2026' : 'Cancel Order'}
      </Button>
      {message ? (
        <p role="status" aria-live="polite" className="text-xs text-[#8C7B6B]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
