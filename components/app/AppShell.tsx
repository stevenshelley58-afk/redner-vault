'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, LayoutDashboard, LifeBuoy, Plus, Sparkles, UserRound } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AvatarCircle } from './AvatarCircle';

interface AppShellProps {
  children: ReactNode;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/projects',
    icon: LayoutDashboard,
    match: (path: string) => path.startsWith('/projects'),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: UserRound,
    match: (path: string) => path.startsWith('/profile'),
  },
  {
    label: 'Support',
    href: 'mailto:hello@rendervault.studio',
    icon: LifeBuoy,
    match: () => false,
    external: true,
  },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] text-[#1b2559]">
      <aside className="relative hidden w-[250px] shrink-0 border-r border-white/70 bg-white/95 px-4 py-6 shadow-[0_18px_40px_rgba(112,144,176,0.12)] lg:block">
        <div className="sticky top-6 flex h-[calc(100vh-48px)] flex-col rounded-[22px] bg-white/95 p-4 shadow-[0_18px_40px_rgba(112,144,176,0.16)] ring-1 ring-white/80">
          <Link href="/projects" className="flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-[#f5f7fb]">
            <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#4b6a8e] via-[#4f78a5] to-[#6bc6b5] text-white shadow-[0_10px_28px_rgba(79,120,165,0.28)]">
              RV
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Render Vault</p>
              <p className="text-xs text-[#7e8aa7]">Creative Ops</p>
            </div>
          </Link>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.match(pathname);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  className={clsx(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    'hover:bg-[#f5f7fb] hover:text-[#2c3654]',
                    isActive
                      ? 'bg-[#e6edf7] text-[#2c3654] shadow-[0_10px_24px_rgba(112,144,176,0.14)] ring-1 ring-[#d4e0f0]'
                      : 'text-[#7e8aa7]',
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-9 w-9 items-center justify-center rounded-[12px] border border-white/70 bg-white shadow-sm transition',
                      isActive ? 'text-[#4f78a5]' : 'text-[#93a0bd] group-hover:text-[#4f78a5]',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-[18px] border border-white/80 bg-gradient-to-br from-[#e7f2ff] via-white to-[#f2f7ff] p-4 shadow-[0_14px_32px_rgba(112,144,176,0.14)]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#4f78a5] shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Vault ready
              </div>
              <p className="text-sm font-semibold text-[#1b2559]">Upgrade for priority renders</p>
              <p className="mt-1 text-xs text-[#7e8aa7]">Move to the Vault tier for reserved capacity.</p>
              <Button
                fullWidth
                className="mt-3 bg-[#4f78a5] text-white shadow-[0_10px_28px_rgba(79,120,165,0.28)] hover:bg-[#486f98]"
              >
                Upgrade
              </Button>
            </div>

            <Link href="/projects/new">
              <Button
                fullWidth
                iconLeft={<Plus className="h-4 w-4" />}
                className="bg-[#1b2559] text-white shadow-[0_10px_28px_rgba(27,37,89,0.2)] hover:bg-[#162042]"
              >
                New project
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-[#f5f7fb]/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-[#f5f7fb]/75 lg:px-8 lg:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-2 lg:hidden shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#4b6a8e] via-[#4f78a5] to-[#6bc6b5] text-white shadow-[0_10px_28px_rgba(79,120,165,0.28)]">
                  RV
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">Render Vault</p>
                  <p className="text-[10px] text-[#7e8aa7] truncate">Workspace</p>
                </div>
              </div>
              <Badge variant="accent" className="hidden sm:inline-flex bg-[#e8eef9] text-[#3f5f82] ring-1 ring-[#d8e3f5] text-xs shrink-0">
                Vault Studio - Free plan
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Link href="/projects/new">
                <Button
                  variant="secondary"
                  className="rounded-full bg-white text-[#1b2559] shadow-[0_10px_24px_rgba(112,144,176,0.18)] hover:bg-white/90 h-9 px-3 lg:px-4"
                  iconLeft={<Plus className="h-4 w-4" />}
                >
                  <span className="hidden sm:inline">Start brief</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </Link>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4f78a5] shadow-[0_8px_18px_rgba(112,144,176,0.18)] transition hover:bg-white/90">
                <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
              <Link href="/profile" className="flex items-center">
                <AvatarCircle />
              </Link>
            </div>
          </div>
        </header>

        <main className="relative flex-1 px-4 pb-6 pt-4 lg:px-10 lg:pb-10 lg:pt-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,120,165,0.08),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(107,203,119,0.07),transparent_42%)]" />
          <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-4 lg:gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
