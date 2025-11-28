export type ProjectStatus =
  | 'draft'
  | 'in_review'
  | 'in_progress'
  | 'awaiting_client'
  | 'completed'
  | 'archived';

export type ImageStatus =
  | 'draft'
  | 'processing'
  | 'delivered'
  | 'needs_revision'
  | 'approved'
  | 'archived';

export type VersionStatus = 'candidate' | 'delivered' | 'approved' | 'rejected';

type StatusConfig = {
  label: string;
  className: string;
};

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, StatusConfig> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border border-slate-200' },
  in_review: { label: 'In review', className: 'bg-amber-100 text-amber-800 border border-amber-200' },
  in_progress: { label: 'In progress', className: 'bg-blue-100 text-blue-800 border border-blue-200' },
  awaiting_client: {
    label: 'Awaiting you',
    className: 'bg-pink-100 text-pink-800 border border-pink-200',
  },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  archived: { label: 'Archived', className: 'bg-slate-200 text-slate-700 border border-slate-300' },
};

export const IMAGE_STATUS_CONFIG: Record<ImageStatus, StatusConfig> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border border-slate-200' },
  processing: {
    label: 'Processing',
    className: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  delivered: { label: 'Delivered', className: 'bg-blue-100 text-blue-800 border border-blue-200' },
  needs_revision: {
    label: 'Needs revision',
    className: 'bg-pink-100 text-pink-800 border border-pink-200',
  },
  approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  archived: { label: 'Archived', className: 'bg-slate-200 text-slate-700 border border-slate-300' },
};

export const VERSION_STATUS_CONFIG: Record<VersionStatus, StatusConfig> = {
  candidate: {
    label: 'Candidate',
    className: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  delivered: { label: 'Delivered', className: 'bg-blue-100 text-blue-800 border border-blue-200' },
  approved: { label: 'Approved', className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  rejected: { label: 'Rejected', className: 'bg-rose-100 text-rose-800 border border-rose-200' },
};

