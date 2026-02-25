'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { updateOrderStatus } from '@/app/actions/admin';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

interface BulkOrderActionsProps {
  selectedIds: Set<string>;
  onClearSelection: () => void;
}

export function BulkOrderActions({ selectedIds, onClearSelection }: BulkOrderActionsProps) {
  const [targetStatus, setTargetStatus] = useState('');
  const [isPending, startTransition] = useTransition();

  const count = selectedIds.size;

  if (count === 0) return null;

  function handleBulkUpdate() {
    if (!targetStatus) return;

    startTransition(async () => {
      let successCount = 0;
      let failCount = 0;

      const ids = Array.from(selectedIds);
      const results = await Promise.allSettled(
        ids.map((id) => updateOrderStatus(id, targetStatus)),
      );

      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.success) {
          successCount++;
        } else {
          failCount++;
        }
      }

      if (successCount > 0 && failCount === 0) {
        toast.success(`Updated ${successCount} order${successCount !== 1 ? 's' : ''} to "${targetStatus}".`);
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(`${successCount} updated, ${failCount} failed.`);
      } else {
        toast.error(`Failed to update ${failCount} order${failCount !== 1 ? 's' : ''}.`);
      }

      setTargetStatus('');
      onClearSelection();
    });
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 mx-auto flex w-fit items-center gap-3 rounded-2xl border border-[#E8DDD0] bg-white px-5 py-3 shadow-lg">
      <span className="text-sm font-medium text-[#6B5344]">
        {count} selected
      </span>
      <select
        value={targetStatus}
        onChange={(e) => setTargetStatus(e.target.value)}
        disabled={isPending}
        className="rounded-lg border border-[#E8DDD0] bg-[#FAF7F2] px-3 py-1.5 text-sm text-[#6B5344] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82]"
        aria-label="Bulk status"
      >
        <option value="">Set status…</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleBulkUpdate}
        disabled={!targetStatus || isPending}
        className="rounded-lg bg-[#8B9F82] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#7A8F72] disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Updating…
          </span>
        ) : (
          `Update ${count} order${count !== 1 ? 's' : ''}`
        )}
      </button>
      <button
        type="button"
        onClick={onClearSelection}
        disabled={isPending}
        className="rounded-lg px-3 py-1.5 text-sm text-[#8C7B6B] transition-colors hover:bg-[#F5F0E8]"
      >
        Cancel
      </button>
    </div>
  );
}
