'use client';

import { useState, useTransition } from 'react';

import { updateOrderStatus } from '@/app/actions/admin';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-[#8C7B6B]/10 text-[#8C7B6B] border-[#8C7B6B]/20',
  preparing: 'bg-[#C4A35A]/10 text-[#C4A35A] border-[#C4A35A]/20',
  ready: 'bg-[#8B9F82]/10 text-[#8B9F82] border-[#8B9F82]/20',
  completed: 'bg-[#8B9F82]/10 text-[#8B9F82] border-[#8B9F82]/20',
  cancelled: 'bg-[#A0524F]/10 text-[#A0524F] border-[#A0524F]/20',
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['completed'],
  completed: [],
  cancelled: [],
};

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] ?? [];
  const isTerminal = allowedTransitions.length === 0;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (!result.success) {
        setError(result.message);
      }
    });
  }

  if (isTerminal) {
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[currentStatus] ?? ''}`}
      >
        {STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label ?? currentStatus}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        aria-label="Update order status"
        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82] disabled:opacity-50 ${STATUS_COLORS[currentStatus] ?? ''}`}
      >
        <option value={currentStatus}>
          {STATUS_OPTIONS.find((s) => s.value === currentStatus)?.label}
        </option>
        {allowedTransitions.map((status) => (
          <option key={status} value={status}>
            {STATUS_OPTIONS.find((s) => s.value === status)?.label}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#8C7B6B] border-t-transparent" />
      )}
      {error && <span className="text-xs text-[#A0524F]">{error}</span>}
    </div>
  );
}
