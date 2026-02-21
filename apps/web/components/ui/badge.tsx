import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-[#f3ede3] px-2.5 py-1 text-xs font-medium text-[#5b4632]',
        className,
      )}
      {...props}
    />
  );
}
