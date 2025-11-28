import type { ProjectStatus } from './status';

export type ProjectType = 'image_render' | 'website_build' | 'other';

export type ProjectListItem = {
  id: string;
  name: string;
  project_type: ProjectType;
  status: ProjectStatus;
  brief?: string;
  due_date?: string | null;
  updated_at: string;
  images_count: number;
  latest_version: number;
  billing_period_label: string;
};

