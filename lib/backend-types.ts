import type { ProjectType } from './project-types';
import type { ImageStatus, ProjectStatus, VersionStatus } from './status';

export type ProfileRecord = {
  id: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  company_name: string | null;
  country: string | null;
  timezone: string | null;
  role: string | null;
  member_id: string | null;
  created_at: string;
  updated_at: string;
};

export type BrandRecord = {
  id: string;
  user_id: string;
  brand_name: string | null;
  brand_summary: string | null;
  tone_of_voice: string | null;
  visual_style: string | null;
  font_preferences: string | null;
  notes: string | null;
  logo_url: string | null;
  primary_colors?: string[] | null;
  created_at: string;
  updated_at: string;
};

export type BillingAccountRecord = {
  id: string;
  user_id: string;
  plan: string | null;
  credits_balance: number;
  created_at: string;
  updated_at: string;
};

export type BillingTransactionRecord = {
  id: string;
  billing_account_id: string;
  delta: number;
  reason: string | null;
  notes: string | null;
  created_at: string;
};

export type ProjectRecord = {
  id: string;
  user_id: string;
  name: string;
  project_type: ProjectType;
  status: ProjectStatus;
  brief: string | null;
  agreed_deliverables: string | null;
  due_date: string | null;
  billing_period_label: string | null;
  images_count: number;
  latest_version: number;
  created_at: string;
  updated_at: string;
};

export type ProjectAssetRecord = {
  id: string;
  project_id: string;
  type: 'source_image' | 'reference_image' | 'material_doc' | 'inspiration' | 'other';
  label: string;
  file_url: string | null;
  file_thumbnail_url: string | null;
  created_at: string;
};

export type ProjectNoteRecord = {
  id: string;
  project_id: string;
  author_type: 'customer' | 'staff';
  author_name: string | null;
  body: string;
  created_at: string;
};

export type ProjectImageRecord = {
  id: string;
  project_id: string;
  title: string;
  status: ImageStatus;
  preview_url: string | null;
  primary_output_url: string | null;
  sort_order: number;
  latest_version: number;
  created_at: string;
  updated_at: string;
};

export type ImageVersionRecord = {
  id: string;
  image_id: string;
  version_number: number;
  status: VersionStatus;
  output_url: string;
  preview_url: string | null;
  notes: string | null;
  created_at: string;
  created_by_name: string | null;
};

export type ImageCommentRecord = {
  id: string;
  image_id: string;
  version_number: number;
  author_type: 'customer' | 'staff';
  author_name: string | null;
  body: string;
  created_at: string;
};
