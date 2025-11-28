'use client';

import { useState } from 'react';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Button } from '../ui/Button';
import type { ProjectType } from '../../lib/project-types';

type NewProjectFormProps = {
  onCreate: (input: NewProjectFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
};

export type NewProjectFormValues = {
  name: string;
  project_type: ProjectType;
  brief: string;
  due_date: string;
};

const defaultForm: NewProjectFormValues = {
  name: '',
  project_type: 'image_render',
  brief: '',
  due_date: '',
};

export function NewProjectForm({ onCreate, onCancel, submitLabel = 'Create project' }: NewProjectFormProps) {
  const [form, setForm] = useState<NewProjectFormValues>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onCreate(form);
      setForm(defaultForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
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
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
