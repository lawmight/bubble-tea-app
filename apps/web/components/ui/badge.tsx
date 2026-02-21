import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[#F5F0E8] px-2.5 py-1 text-xs font-medium text-[#6B5344]',
        className,
      )}
      {...props}
    />
  );
}
