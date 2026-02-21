import type { InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-[#D4C5B2] bg-[#FAF7F2] px-3 text-sm text-[#6B5344]',
        'placeholder:text-[#8C7B6B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B9F82]',
        className,
      )}
      {...props}
    />
  );
}
