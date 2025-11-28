import type { HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

export function Card({ header, footer, className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-border-ghost bg-surface/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.09)] backdrop-blur-sm md:p-6',
        className,
      )}
      {...props}
    >
      {header && <div className="mb-4">{header}</div>}
      <div>{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

