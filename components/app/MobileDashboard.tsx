'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface MobileDashboardProps {
  children: ReactNode;
}

export function MobileDashboard({ children }: MobileDashboardProps) {
  return (
    <div className="flex justify-center items-start pt-8 pb-8 min-h-screen bg-gray-100 md:hidden">
      <div className="w-[390px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Phone Notch */}
        <div className="bg-gray-900 h-8 flex items-center justify-center">
          <div className="w-24 h-5 bg-black rounded-full" />
        </div>

        {/* Phone Content */}
        <div className="h-[750px] overflow-hidden relative bg-gray-50">
          {/* App Header - Simple */}
          <DashboardHeader />

          {/* Main Content */}
          <div className="h-full overflow-y-auto pb-24">{children}</div>

          {/* Bottom Navigation */}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DASHBOARD HEADER - Clean, minimal
// ============================================================================

function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-100 px-5 py-4">
      <div className="flex items-center justify-between">
        {/* Logo - single instance */}
        <span
          className="text-base tracking-widest uppercase"
          style={{
            fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
            fontWeight: 400,
            letterSpacing: '0.12em',
            color: '#1a2b4a',
          }}
        >
          RENDER VAULT
        </span>

        {/* User Avatar */}
        <Link href="/profile" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}

// ============================================================================
// HOME SCREEN - Primary dashboard view
// ============================================================================

interface HomeScreenProps {
  activeCount?: number;
  onNewProject?: () => void;
}

export function HomeScreen({ activeCount = 0, onNewProject }: HomeScreenProps) {
  return (
    <div className="px-5 py-6">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-gray-500">What would you like to do?</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        {/* New Project - Primary CTA */}
        <button
          onClick={onNewProject}
          className="w-full flex items-center gap-4 p-5 rounded-2xl text-white"
          style={{ backgroundColor: '#1a2b4a' }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-left">
            <div className="font-semibold text-lg">Start New Project</div>
            <div className="text-white/70 text-sm">Create a brief for new renders</div>
          </div>
          <svg className="w-5 h-5 ml-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Current Projects */}
        <Link
          href="/projects"
          className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Current Projects</div>
            <div className="text-gray-500 text-sm">{activeCount} active</div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Your Account */}
        <Link
          href="/profile"
          className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Your Account</div>
            <div className="text-gray-500 text-sm">Profile, billing & preferences</div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Contact Us */}
        <button
          onClick={() => {
            window.location.href = 'mailto:hello@rendervault.studio';
          }}
          className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Contact Us</div>
            <div className="text-gray-500 text-sm">Get help or send feedback</div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// PROJECTS SCREEN - Empty state or project list
// ============================================================================

interface ProjectsScreenProps {
  projects?: Array<{ id: string; name: string; status: string }>;
  onCreateProject?: () => void;
}

export function ProjectsScreen({ projects = [], onCreateProject }: ProjectsScreenProps) {
  if (projects.length === 0) {
    return (
      <div className="px-5 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Create your first project to share a brief, upload references, and review renders.
          </p>
          <button
            onClick={onCreateProject}
            className="w-full text-white py-4 rounded-xl font-medium"
            style={{ backgroundColor: '#1a2b4a' }}
          >
            + New project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
      </div>

      {/* Project List */}
      <div className="space-y-3">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{project.name}</div>
              <div className="text-gray-500 text-sm capitalize">{project.status.replace('_', ' ')}</div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// ACCOUNT SCREEN
// ============================================================================

interface AccountScreenProps {
  userEmail?: string;
  onLogout?: () => void;
}

export function AccountScreen({ userEmail = 'user@example.com', onLogout }: AccountScreenProps) {
  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <Link href="/profile" className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Your Profile</div>
            <div className="text-gray-500 text-sm">{userEmail}</div>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Menu Items */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        <Link href="/profile" className="w-full flex items-center gap-4 p-4 text-left">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <span className="flex-1 text-gray-900">Billing & payments</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <button className="w-full flex items-center gap-4 p-4 text-left">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="flex-1 text-gray-900">Notifications</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => {
            window.location.href = 'mailto:hello@rendervault.studio';
          }}
          className="w-full flex items-center gap-4 p-4 text-left"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="flex-1 text-gray-900">Help & support</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full mt-4 p-4 text-red-600 font-medium text-center"
      >
        Log out
      </button>
    </div>
  );
}

// ============================================================================
// BOTTOM NAVIGATION
// ============================================================================

function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { id: 'home', label: 'Home', href: '/dashboard', icon: HomeIcon },
    { id: 'projects', label: 'Projects', href: '/projects', icon: FolderIcon },
    { id: 'account', label: 'Account', href: '/profile', icon: UserIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 pb-4">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-2 px-4 ${active ? 'text-gray-900' : 'text-gray-400'}`}
            >
              <Icon className="w-6 h-6" filled={active} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Icons
function HomeIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ) : (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function FolderIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
    </svg>
  ) : (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );
}

function UserIcon({ className, filled }: { className?: string; filled?: boolean }) {
  return filled ? (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  ) : (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

