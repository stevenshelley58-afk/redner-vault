'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemProps {
  id: string;
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: (id: string) => void;
}

export function AccordionItem({
  id,
  title,
  icon,
  badge,
  children,
  defaultOpen,
  isOpen: controlledOpen,
  onToggle,
}: AccordionItemProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(Boolean(defaultOpen));

  const open = controlledOpen ?? uncontrolledOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(id);
    } else {
      setUncontrolledOpen((prev) => !prev);
    }
  };

  return (
    <div className="rounded-2xl border border-border-ghost bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left md:px-5 md:py-4"
      >
        {icon && <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-accent">{icon}</div>}
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-medium text-text-ink">{title}</span>
        </div>
        {badge && <div className="mr-2 text-xs text-text-subtle">{badge}</div>}
        <ChevronDown
          className={clsx(
            'h-4 w-4 text-text-subtle transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      <div
        className={clsx(
          'grid overflow-hidden border-t border-border-ghost transition-[grid-template-rows,opacity] duration-200 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0 px-4 pb-4 pt-1 text-sm text-text-subtle md:px-5 md:pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}

