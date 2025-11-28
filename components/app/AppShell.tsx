'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { AvatarCircle } from './AvatarCircle';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg-paper text-text-ink">
      <header className="sticky top-0 z-30 border-b border-border-ghost bg-bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/app" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-[#4f46e5] shadow-md" />
            <span className="text-sm font-semibold tracking-tight md:text-base">
              Render Vault
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-xs"
              >
                Login
              </Button>
            </Link>
            <Link href="/projects" className="hidden md:inline-flex">
              <Button
                variant="secondary"
                className="text-xs"
              >
                My Projects
              </Button>
            </Link>
            <Link href="/profile" className="flex items-center gap-2">
              <span className="hidden text-xs text-text-subtle md:inline">
                Profile
              </span>
              <AvatarCircle />
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-8 pt-6 md:px-6 md:pb-12 md:pt-10">
        {children}
      </main>
    </div>
  );
}
