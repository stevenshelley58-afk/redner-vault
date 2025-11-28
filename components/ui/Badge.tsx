import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'outline' | 'accent';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        {
          'bg-surface text-text-subtle border border-border-ghost': variant === 'default',
          'border border-border-ghost text-text-subtle bg-transparent': variant === 'outline',
          'bg-accent/10 text-accent border border-accent/20': variant === 'accent',
        },
        className,
      )}
      {...props}
    />
  );
}

