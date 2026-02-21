import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#E8DDD0] bg-white p-4 shadow-[0_1px_3px_rgba(107,83,68,0.06)]',
        className,
      )}
      {...props}
    />
  );
}
