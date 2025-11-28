'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import type { ProjectListItem, ProjectType } from '../../lib/project-types';

type NewProjectFormProps = {
  onCreate: (project: ProjectListItem) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

const defaultForm = {
  name: '',
  project_type: 'image_render' as ProjectType,
  brief: '',
  due_date: '',
};

function makeFallbackName() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return `New project ${date} ${time}`;
}

function currentBillingPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function NewProjectForm({ onCreate, onCancel, submitLabel = 'Create project' }: NewProjectFormProps) {
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = () => {
    const project: ProjectListItem = {
      id: crypto.randomUUID(),
      name: form.name.trim() || makeFallbackName(),
      project_type: form.project_type,
      status: 'draft',
      brief: form.brief.trim(),
      due_date: form.due_date || null,
      updated_at: new Date().toISOString(),
      images_count: 0,
      latest_version: 0,
      billing_period_label: currentBillingPeriod(),
    };
    onCreate(project);
    setForm(defaultForm);
  };

  return (
    <div className="space-y-3">
      <label className="space-y-1 text-sm font-medium text-text-ink">
        Project type
        <select
          value={form.project_type}
          onChange={(e) => setForm({ ...form, project_type: e.target.value as ProjectType })}
          className="w-full rounded-lg border border-border-ghost bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-paper"
        >
          <option value="image_render">Image render</option>
          <option value="website_build">Website build</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="space-y-1 text-sm font-medium text-text-ink">
        Project name
        <Input
          placeholder='e.g. "Summer campaign" (leave blank to auto-name)'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <label className="space-y-1 text-sm font-medium text-text-ink">
        Brief
        <TextArea
          placeholder="What do you need? Key requirements, references, outputs..."
          value={form.brief}
          onChange={(e) => setForm({ ...form, brief: e.target.value })}
          rows={4}
        />
      </label>

      <label className="space-y-1 text-sm font-medium text-text-ink">
        Due date (optional)
        <Input
          type="date"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
        />
      </label>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit}>{submitLabel}</Button>
      </div>
    </div>
  );
}

