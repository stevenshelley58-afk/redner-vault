'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { Calendar, ChevronRight, Image as ImageIcon, Layers, Plus, Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { StatusPill } from '../../../components/app/StatusPill';
import { NewProjectForm, type NewProjectFormValues } from '../../../components/app/NewProjectForm';
import { formatDate, formatRelativeTime } from '../../../lib/date';
import type { ProjectType } from '../../../lib/project-types';
import type { ProjectStatus } from '../../../lib/status';
import type { ProjectRecord } from '../../../lib/backend-types';

type FilterKey = 'all' | 'active' | 'draft' | 'completed';

const PROJECT_TYPES: Record<ProjectType, { label: string; badge: string; icon: ComponentType<{ className?: string }> }> = {
  image_render: { label: 'Image render', badge: 'bg-[#e8eef9] text-[#3f5f82] border border-white/80', icon: ImageIcon },
  website_build: { label: 'Website build', badge: 'bg-[#e9e7ff] text-[#4d3fb3] border border-white/80', icon: Layers },
  other: { label: 'Other', badge: 'bg-[#eef2f6] text-[#445168] border border-white/80', icon: Layers },
};

const FILTERS: { key: FilterKey; label: string; statuses?: ProjectStatus[] }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active', statuses: ['in_review', 'in_progress', 'awaiting_client'] },
  { key: 'draft', label: 'Drafts', statuses: ['draft'] },
  { key: 'completed', label: 'Completed', statuses: ['completed'] },
];

function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: FilterKey;
  onChange: (next: FilterKey) => void;
  counts: Record<FilterKey, number>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {FILTERS.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onChange(filter.key)}
          className={clsx(
            'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm transition',
            'border border-white/70 bg-white/80 text-[#5b6680] shadow-[0_10px_24px_rgba(112,144,176,0.08)] hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(112,144,176,0.12)]',
            active === filter.key && 'border-[#d4e0f0] bg-[#e8eef9] text-[#1b2559]',
          )}
        >
          {filter.label}
          {counts[filter.key] > 0 && (
            <span className="rounded-full border border-white/70 bg-[#f5f7fb] px-2 py-0.5 text-[11px] font-semibold text-[#3f4b68]">
              {counts[filter.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectRecord }) {
  const router = useRouter();
  const typeConfig = PROJECT_TYPES[project.project_type];

  return (
    <button
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group relative flex w-full flex-col gap-3 overflow-hidden rounded-[20px] border border-white/70 bg-white/95 p-5 text-left shadow-[0_18px_40px_rgba(112,144,176,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(112,144,176,0.18)]"
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            'flex h-11 w-11 items-center justify-center rounded-[14px] text-sm font-semibold shadow-[0_10px_24px_rgba(112,144,176,0.12)] ring-1 ring-white/70',
            typeConfig?.badge ?? 'bg-[#eef2f6] text-[#445168] border border-white/80',
          )}
        >
          {typeConfig?.icon ? <typeConfig.icon className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#7e8aa7]">
              {typeConfig?.label ?? 'Project'}
            </span>
            <span className="text-[11px] text-[#9aa5bf]">{project.billing_period_label || '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold leading-tight text-[#1b2559]">{project.name}</h3>
            <StatusPill kind="project" status={project.status} />
          </div>
          {project.brief ? (
            <p className="line-clamp-2 text-sm text-[#55607a]">{project.brief}</p>
          ) : (
            <p className="text-sm text-[#9aa5bf]">No brief yet.</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#5b6680]">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-[#f5f7fb] px-2 py-1 text-xs shadow-sm">
            <ImageIcon className="h-3.5 w-3.5 text-[#7e8aa7]" />
            {project.images_count} images
          </div>
          <div className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-[#f5f7fb] px-2 py-1 text-xs shadow-sm">
            <Layers className="h-3.5 w-3.5 text-[#7e8aa7]" />
            v{project.latest_version || 1}
          </div>
        </div>
        <span className="text-[11px] uppercase tracking-wide text-[#9aa5bf]">
          Updated {formatRelativeTime(project.updated_at)}
        </span>
      </div>

      {project.due_date && (
        <div
          className={clsx(
            'inline-flex items-center gap-2 self-start rounded-xl px-3 py-1.5 text-xs font-medium',
            'border border-white/70 bg-[#f5f7fb] text-[#3f4b68] shadow-sm',
          )}
        >
          <Calendar className="h-4 w-4 text-[#7e8aa7]" />
          Due {formatDate(project.due_date)}
        </div>
      )}

      <span className="absolute right-4 top-4 text-[10px] uppercase tracking-wide text-[#9aa5bf] transition group-hover:text-[#5b6680]">
        Open
      </span>
    </button>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[22px] border border-dashed border-[#d4e0f0] bg-white/90 px-8 py-12 text-center shadow-[0_14px_32px_rgba(112,144,176,0.12)]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f7fb] text-[#4f78a5] shadow-inner">
        <ImageIcon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-[#1b2559]">No projects yet</h3>
      <p className="mt-2 max-w-sm text-sm text-[#55607a]">
        Create your first project to share a brief, upload references, and review renders in one place.
      </p>
      <Button
        onClick={onCreate}
        className="mt-4 rounded-full shadow-[0_10px_24px_rgba(112,144,176,0.14)]"
        iconLeft={<Plus className="h-4 w-4" />}
      >
        New project
      </Button>
    </div>
  );
}

function NewProjectSheet({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: NewProjectFormValues) => Promise<void>;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f172a]/30 px-4 py-6 backdrop-blur-md md:items-center">
      <div className="w-full max-w-xl rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_28px_70px_rgba(112,144,176,0.25)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#1b2559]">New project</h3>
            <p className="text-sm text-[#55607a]">Add a brief and optional due date to kick things off.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/70 bg-[#f5f7fb] px-3 py-1 text-xs font-semibold text-[#5b6680] transition hover:bg-white"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <NewProjectForm
            onCreate={async (input) => {
              await onCreate(input);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

function MobileHomeCard({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-white/70 bg-white px-4 py-4 text-left shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f78a5]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5f7fb] text-[#4f78a5]">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-lg font-semibold text-[#1b2559]">{label}</p>
        {description && <p className="text-sm text-[#7e8aa7]">{description}</p>}
      </div>
      <ChevronRight className="h-5 w-5 text-[#9aa5bf]" />
    </button>
  );
}

function DashboardMobileHome({
  activeCount,
  onOpenProjects,
  onNewProject,
  onAccount,
  onContact,
}: {
  activeCount: number;
  onOpenProjects: () => void;
  onNewProject: () => void;
  onAccount: () => void;
  onContact: () => void;
}) {
  return (
    <div className="block md:hidden">
      <div className="flex flex-col items-center gap-2 py-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#4b6a8e] via-[#4f78a5] to-[#6bc6b5] text-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          RV
        </div>
        <h1 className="text-2xl font-semibold text-[#1b2559]">Render Vault</h1>
      </div>
      <div className="space-y-3 pb-2">
        <MobileHomeCard
          icon={ImageIcon}
          label="Current Projects"
          description={`${activeCount} active`}
          onClick={onOpenProjects}
        />
        <MobileHomeCard icon={Plus} label="Start New Project" onClick={onNewProject} />
        <MobileHomeCard icon={Layers} label="Your Account" onClick={onAccount} />
        <MobileHomeCard icon={Sparkles} label="Contact Us" onClick={onContact} />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showFullMobileDashboard, setShowFullMobileDashboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now] = useState(() => Date.now());
  const projectsSectionRef = useRef<HTMLDivElement>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/projects');
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Unable to load projects');
      setLoading(false);
      return;
    }
    setProjects(data.projects ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects();
  }, [loadProjects]);

  const counts = useMemo(() => {
    const base: Record<FilterKey, number> = { all: projects.length, active: 0, draft: 0, completed: 0 };
    for (const project of projects) {
      if (FILTERS.find((f) => f.key === 'active')?.statuses?.includes(project.status)) base.active += 1;
      if (project.status === 'draft') base.draft += 1;
      if (project.status === 'completed') base.completed += 1;
    }
    return base;
  }, [projects]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return projects
      .filter((project) => {
        if (filter !== 'all') {
          const allowed = FILTERS.find((f) => f.key === filter)?.statuses;
          if (allowed && !allowed.includes(project.status)) return false;
        }
        if (!query) return true;
        return project.name.toLowerCase().includes(query) || project.brief?.toLowerCase().includes(query);
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [projects, filter, search]);

  const stats = useMemo(() => {
    const activeStatuses: ProjectStatus[] = ['in_review', 'in_progress'];
    const awaitingStatuses: ProjectStatus[] = ['awaiting_client'];

    const withDue = projects
      .filter((p) => p.due_date)
      .map((p) => ({ ...p, due: new Date(p.due_date as string) }))
      .filter((p) => !Number.isNaN(p.due.getTime()));

    const nextDue = withDue
      .filter((p) => p.due.getTime() >= now - 24 * 60 * 60 * 1000)
      .sort((a, b) => a.due.getTime() - b.due.getTime())[0];

    return {
      total: projects.length,
      active: projects.filter((p) => activeStatuses.includes(p.status)).length,
      awaiting: projects.filter((p) => awaitingStatuses.includes(p.status)).length,
      drafts: projects.filter((p) => p.status === 'draft').length,
      completed: projects.filter((p) => p.status === 'completed').length,
      images: projects.reduce((sum, p) => sum + (p.images_count || 0), 0),
      nextDue,
    };
  }, [projects, now]);

  const handleCreateProject = async (input: NewProjectFormValues) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (res.status === 401) {
      router.push('/login');
      return;
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? 'Failed to create project');
    }

    setProjects((prev) => [data.project, ...prev]);
  };

  return (
    <div className="space-y-6">
      <DashboardMobileHome
        activeCount={stats.active}
        onOpenProjects={() => {
          setShowFullMobileDashboard(true);
          projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onNewProject={() => setSheetOpen(true)}
        onAccount={() => router.push('/profile')}
        onContact={() => {
          window.location.href = 'mailto:hello@rendervault.studio';
        }}
      />

      <section className={clsx('grid gap-4', showFullMobileDashboard ? undefined : 'hidden md:grid')}>
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#4b6a8e] via-[#4f78a5] to-[#6bc6b5] text-white shadow-[0_18px_40px_rgba(79,120,165,0.28)]">
          <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white/70">Workspace overview</p>
                <h1 className="text-3xl font-semibold leading-tight">Projects</h1>
                <p className="text-sm text-white/80">Briefs, deliverables, and output reviews in one vault.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold shadow-inner backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Queue steady
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Active projects', value: stats.active },
                { label: 'Awaiting your review', value: stats.awaiting },
                { label: 'Completed', value: stats.completed },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/10 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur"
                >
                  <p className="text-sm text-white/75">{item.label}</p>
                  <p className="text-3xl font-semibold leading-tight">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-white/85">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                <Calendar className="h-4 w-4" />
                {stats.nextDue ? `Next due: ${formatDate(stats.nextDue.due_date ?? '')}` : 'No due dates set'}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
                <ImageIcon className="h-4 w-4" />
                {stats.images} images delivered
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={projectsSectionRef}
        className={clsx(
          'rounded-[20px] border border-white/70 bg-white/95 p-4 shadow-[0_14px_32px_rgba(112,144,176,0.12)]',
          showFullMobileDashboard ? 'block' : 'hidden md:block',
        )}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#9aa5bf]" />
            <Input
              placeholder="Search by name or brief..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-full border-white/80 bg-[#f5f7fb] pl-10 text-[#1b2559] shadow-inner placeholder:text-[#9aa5bf] focus-visible:ring-[#4f78a5] focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[#f5f7fb] text-[#3f4b68] ring-1 ring-white/70">
              Showing {filtered.length} of {projects.length}
            </Badge>
          </div>
        </div>
        <div className="mt-3">
          <FilterTabs active={filter} onChange={setFilter} counts={counts} />
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-[22px] border border-dashed border-border-ghost bg-white/90 px-6 py-8 text-center text-sm text-text-subtle">
          Loading your projects...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onCreate={() => setSheetOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <NewProjectSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
