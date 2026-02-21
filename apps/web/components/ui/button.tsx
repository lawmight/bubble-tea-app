import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#245741] text-white hover:bg-[#1f4a37] focus-visible:outline-[#245741] disabled:bg-[#245741]/50',
  secondary:
    'bg-[#f3ede3] text-[#2a2a2a] hover:bg-[#e9dfd1] focus-visible:outline-[#aa7f5f] disabled:bg-[#f3ede3]/60',
  ghost:
    'bg-transparent text-[#2a2a2a] hover:bg-[#f8f4ed] focus-visible:outline-[#aa7f5f] disabled:text-[#2a2a2a]/40',
  danger:
    'bg-[#8f3331] text-white hover:bg-[#7b2b2a] focus-visible:outline-[#8f3331] disabled:bg-[#8f3331]/40',
};

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-11 min-w-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
