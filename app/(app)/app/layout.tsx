import type { ReactNode } from 'react';

// This layout simply passes through; the group layout already applies AppShell.
export default function AppLayout({ children }: { children: ReactNode }) {
  return children;
}
