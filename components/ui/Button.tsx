'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  iconLeft,
  iconRight,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-paper',
        {
          'bg-accent text-white shadow-sm hover:bg-accent/90 active:bg-accent/80':
            variant === 'primary',
          'bg-surface text-text-ink border border-border-ghost hover:bg-surface/80':
            variant === 'secondary',
          'text-text-subtle hover:bg-surface border border-transparent':
            variant === 'ghost',
          'bg-[#fef2f2] text-[#b91c1c] hover:bg-[#fee2e2]':
            variant === 'danger',
        },
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {iconLeft && <span className="inline-flex h-4 w-4 items-center justify-center">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="inline-flex h-4 w-4 items-center justify-center">{iconRight}</span>}
    </button>
  );
}

