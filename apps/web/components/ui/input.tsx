import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-[#d8c7b0] bg-white px-3 text-sm text-[#2a2a2a]',
        'placeholder:text-[#7e6d58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245741]',
        className,
      )}
      {...props}
    />
  );
}
