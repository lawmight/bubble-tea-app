import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[#e6dac9] bg-white p-4 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
