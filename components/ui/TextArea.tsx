'use client';

import type { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-lg border border-border-ghost bg-white px-3 py-2 text-sm text-text-ink shadow-sm',
        'placeholder:text-text-subtle/70',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-paper',
        'min-h-[120px]',
        className,
      )}
      {...props}
    />
  );
}

