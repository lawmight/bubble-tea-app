import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#8B9F82] text-white hover:bg-[#7A8E72] focus-visible:outline-[#8B9F82] disabled:bg-[#8B9F82]/50',
  secondary:
    'bg-[#F5F0E8] text-[#6B5344] hover:bg-[#EBE4D8] focus-visible:outline-[#6B5344] disabled:bg-[#F5F0E8]/60',
  ghost:
    'bg-transparent text-[#6B5344] hover:bg-[#F5F0E8] focus-visible:outline-[#8B9F82] disabled:text-[#6B5344]/40',
  danger:
    'bg-[#A0524F] text-white hover:bg-[#8C4542] focus-visible:outline-[#A0524F] disabled:bg-[#A0524F]/40',
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
