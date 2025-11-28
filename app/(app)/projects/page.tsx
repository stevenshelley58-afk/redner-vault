'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { Calendar, Image, Layers, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusPill } from '../../../components/app/StatusPill';
import { NewProjectForm } from '../../../components/app/NewProjectForm';
import { formatDate, formatRelativeTime } from '../../../lib/date';
import { loadProjectsFromStorage, saveProjectsToStorage } from '../../../lib/project-storage';
import { PROJECT_SEED } from '../../../lib/project-seeds';
import type { ProjectListItem, ProjectType } from '../../../lib/project-types';
import type { ProjectStatus } from '../../../lib/status';

type FilterKey = 'all' | 'active' | 'draft' | 'completed';

const PROJECT_TYPES: Record<ProjectType, { label: string; badge: string; icon: ComponentType<{ className?: string }> }> = {
  image_render: { label: 'Image render', badge: 'bg-blue-50 text-blue-700', icon: Image },
  website_build: { label: 'Website build', badge: 'bg-indigo-50 text-indigo-700', icon: Layers },
  other: { label: 'Other', badge: 'bg-slate-100 text-slate-700', icon: Layers },
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
            'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition',
            'border border-border-ghost text-text-subtle hover:bg-surface',
            active === filter.key && 'border-accent/30 bg-accent/10 text-accent',
          )}
        >
          {filter.label}
          {counts[filter.key] > 0 && (
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-text-subtle">
              {counts[filter.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectListItem }) {
  const router = useRouter();
  const typeConfig = PROJECT_TYPES[project.project_type];

  return (
    <button
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group relative flex w-full flex-col gap-3 rounded-2xl border border-border-ghost bg-surface/60 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold shadow-sm',
            typeConfig?.badge ?? 'bg-slate-100 text-slate-700',
          )}
        >
          {typeConfig?.icon ? <typeConfig.icon className="h-5 w-5" /> : <Image className="h-5 w-5" />}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
              {typeConfig?.label ?? 'Project'}
            </span>
            <span className="text-[11px] text-text-subtle/70">{project.billing_period_label}</span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold leading-tight text-text-ink">{project.name}</h3>
            <StatusPill kind="project" status={project.status} />
          </div>
          {project.brief ? (
            <p className="line-clamp-2 text-sm text-text-subtle">{project.brief}</p>
          ) : (
            <p className="text-sm text-text-subtle/70">No brief yet.</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-text-subtle">
        <div className="flex items-center gap-4">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-xs">
            <Image className="h-3.5 w-3.5 text-text-subtle/80" />
            {project.images_count} images
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-xs">
            <Layers className="h-3.5 w-3.5 text-text-subtle/80" />
            v{project.latest_version || 1}
          </div>
        </div>
        <span className="text-[11px] uppercase tracking-wide text-text-subtle/80">
          Updated {formatRelativeTime(project.updated_at)}
        </span>
      </div>

      {project.due_date && (
        <div
          className={clsx(
            'inline-flex items-center gap-2 self-start rounded-xl px-3 py-1.5 text-xs font-medium',
            'border border-border-ghost bg-white/80 text-text-subtle',
          )}
        >
          <Calendar className="h-4 w-4 text-text-subtle/70" />
          Due {formatDate(project.due_date)}
        </div>
      )}

      <span className="absolute right-4 top-4 text-[10px] uppercase tracking-wide text-text-subtle/70 transition group-hover:text-text-subtle">
        Open
      </span>
    </button>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-ghost bg-surface/40 px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-sm">
        <Image className="h-5 w-5 text-text-subtle" />
      </div>
      <h3 className="text-lg font-semibold text-text-ink">No projects yet</h3>
      <p className="mt-2 max-w-sm text-sm text-text-subtle">
        Create your first project to share a brief, upload references, and review renders in one place.
      </p>
      <Button onClick={onCreate} className="mt-4" iconLeft={<Plus className="h-4 w-4" />}>
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
  onCreate: (project: ProjectListItem) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 py-6 backdrop-blur-sm md:items-center">
      <div className="w-full max-w-xl rounded-2xl border border-border-ghost bg-bg-paper p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-text-ink">New project</h3>
            <p className="text-sm text-text-subtle">Add a brief and optional due date to kick things off.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-border-ghost bg-surface px-2 py-1 text-xs text-text-subtle hover:bg-surface/70"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <NewProjectForm
            onCreate={(project) => {
              onCreate(project);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>(PROJECT_SEED);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const stored = loadProjectsFromStorage();
    if (stored) {
      setProjects(stored);
    }
  }, []);

  useEffect(() => {
    saveProjectsToStorage(projects);
  }, [projects]);

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

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-ink">Projects</h1>
          <p className="text-sm text-text-subtle">Filter, search, and create projects.</p>
        </div>
        <Button onClick={() => setSheetOpen(true)} iconLeft={<Plus className="h-4 w-4" />}>
          New project
        </Button>
      </div>

      <div className="space-y-3 rounded-2xl border border-border-ghost bg-bg-paper p-4 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-text-subtle/70" />
          <Input
            placeholder="Search by name or brief..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <FilterTabs active={filter} onChange={setFilter} counts={counts} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState onCreate={() => setSheetOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <NewProjectSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreate={(p) => setProjects((prev) => [p, ...prev])}
      />
    </div>
  );
}
