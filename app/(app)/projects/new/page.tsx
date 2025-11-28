'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NewProjectForm } from '../../../../components/app/NewProjectForm';
import { loadProjectsFromStorage, saveProjectsToStorage } from '../../../../lib/project-storage';
import { PROJECT_SEED } from '../../../../lib/project-seeds';
import type { ProjectListItem } from '../../../../lib/project-types';

export default function NewProjectPage() {
  const router = useRouter();

  const handleCreate = (project: ProjectListItem) => {
    const existing = loadProjectsFromStorage() ?? PROJECT_SEED;
    const next = [project, ...existing];
    saveProjectsToStorage(next);
    router.push('/projects');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button
        onClick={() => router.push('/projects')}
        className="inline-flex items-center gap-2 text-sm font-medium text-text-subtle transition hover:text-text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </button>

      <div className="rounded-2xl border border-border-ghost bg-bg-paper p-6 shadow-sm">
        <div className="mb-4 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text-ink">New project</h1>
          <p className="text-sm text-text-subtle">
            Add a project type, a name (or let us auto-name it), a short brief, and an optional due date.
          </p>
        </div>

        <NewProjectForm
          onCreate={handleCreate}
          onCancel={() => router.push('/projects')}
          submitLabel="Create project"
        />
      </div>
    </div>
  );
}
