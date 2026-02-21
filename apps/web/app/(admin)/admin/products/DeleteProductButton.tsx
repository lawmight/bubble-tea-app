'use client';

import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { deleteProduct } from '@/app/actions/admin';

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return;

    startTransition(async () => {
      await deleteProduct(productId);
    });
  }

  return (
    <Button
      variant="danger"
      className="h-8 px-3 text-xs"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? '...' : 'Delete'}
    </Button>
  );
}
