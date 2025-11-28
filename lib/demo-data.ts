import type { ImageStatus, ProjectStatus, VersionStatus } from './status';

export type Project = {
  id: string;
  name: string;
  project_type: 'image_render' | 'website_build' | 'other';
  status: ProjectStatus;
  brief: string;
  agreed_deliverables: string;
  due_date: string | null;
  billing_period_label: string;
  updated_at: string;
};

export type ProjectAsset = {
  id: string;
  type: 'source_image' | 'reference_image' | 'material_doc' | 'inspiration' | 'other';
  label: string;
  file_thumbnail_url: string | null;
  created_at: string;
};

export type ProjectNote = {
  id: string;
  author_type: 'customer' | 'staff';
  author_name: string;
  body: string;
  created_at: string;
};

export type ProjectImage = {
  id: string;
  title: string;
  status: ImageStatus;
  preview_url: string | null;
  primary_output_url: string | null;
  sort_order: number;
  latest_version: number;
  created_at: string;
  updated_at: string;
};

export type ImageVersion = {
  id: string;
  version_number: number;
  status: VersionStatus;
  output_url: string;
  preview_url: string;
  notes?: string;
  created_at: string;
  created_by_name: string;
};

export type ImageComment = {
  id: string;
  version_number: number;
  author_type: 'customer' | 'staff';
  author_name: string;
  body: string;
  created_at: string;
};

export const demoProject: Project = {
  id: 'proj_001',
  name: 'Teak Dining Collection',
  project_type: 'image_render',
  status: 'in_progress',
  brief: `Hero images for the new teak dining collection. Need 6 lifestyle shots showing the table and chairs in a warm Australian home setting.

Key requirements:
- Natural light, warm afternoon feel
- Show the grain and texture of the reclaimed teak
- Modern but warm interior backdrop
- Include some lifestyle elements (books, plants, ceramics)`,
  agreed_deliverables: '6 high-res images (4000x3000), 2 square crops for Instagram',
  due_date: '2024-12-05',
  billing_period_label: '2024-11',
  updated_at: '2024-11-27T16:45:00Z',
};

export const demoAssets: ProjectAsset[] = [
  {
    id: 'asset_001',
    type: 'source_image',
    label: 'Dining table hero.jpg',
    file_thumbnail_url: 'https://picsum.photos/seed/a1/200/200',
    created_at: '2024-11-18T15:00:00Z',
  },
  {
    id: 'asset_002',
    type: 'source_image',
    label: 'Chair detail.jpg',
    file_thumbnail_url: 'https://picsum.photos/seed/a2/200/200',
    created_at: '2024-11-18T15:01:00Z',
  },
  {
    id: 'asset_003',
    type: 'reference_image',
    label: 'Style reference 1.png',
    file_thumbnail_url: 'https://picsum.photos/seed/r1/200/200',
    created_at: '2024-11-18T16:00:00Z',
  },
  {
    id: 'asset_004',
    type: 'reference_image',
    label: 'Style reference 2.png',
    file_thumbnail_url: 'https://picsum.photos/seed/r2/200/200',
    created_at: '2024-11-18T16:01:00Z',
  },
  {
    id: 'asset_005',
    type: 'material_doc',
    label: 'Brand guidelines.pdf',
    file_thumbnail_url: null,
    created_at: '2024-11-18T16:30:00Z',
  },
];

export const demoImages: ProjectImage[] = [
  {
    id: 'img_001',
    title: 'Hero shot - table setting',
    status: 'delivered',
    primary_output_url: 'https://picsum.photos/seed/o1/800/600',
    preview_url: 'https://picsum.photos/seed/o1/400/300',
    sort_order: 1,
    latest_version: 3,
    created_at: '2024-11-20T10:00:00Z',
    updated_at: '2024-11-27T14:00:00Z',
  },
  {
    id: 'img_002',
    title: 'Detail - wood grain',
    status: 'approved',
    primary_output_url: 'https://picsum.photos/seed/o2/800/600',
    preview_url: 'https://picsum.photos/seed/o2/400/300',
    sort_order: 2,
    latest_version: 1,
    created_at: '2024-11-20T10:05:00Z',
    updated_at: '2024-11-25T11:00:00Z',
  },
  {
    id: 'img_003',
    title: 'Lifestyle - morning light',
    status: 'needs_revision',
    primary_output_url: 'https://picsum.photos/seed/o3/800/600',
    preview_url: 'https://picsum.photos/seed/o3/400/300',
    sort_order: 3,
    latest_version: 2,
    created_at: '2024-11-20T10:10:00Z',
    updated_at: '2024-11-27T09:00:00Z',
  },
];

export const demoNotes: ProjectNote[] = [
  {
    id: 'note_001',
    author_type: 'customer',
    author_name: 'Client',
    body: 'Uploaded source images. Please highlight specific grain patterns.',
    created_at: '2024-11-18T15:30:00Z',
  },
  {
    id: 'note_002',
    author_type: 'staff',
    author_name: 'Render Vault Team',
    body: 'Reviewed assets. Starting first batch now. ETA for previews is tomorrow.',
    created_at: '2024-11-19T10:00:00Z',
  },
  {
    id: 'note_003',
    author_type: 'customer',
    author_name: 'Client',
    body: 'Looking great so far! Try warmer light temperature on image 3.',
    created_at: '2024-11-26T15:00:00Z',
  },
];

export const demoImageVersions: Record<string, ImageVersion[]> = {
  img_001: [
    {
      id: 'ver_003',
      version_number: 3,
      status: 'delivered',
      output_url: 'https://picsum.photos/seed/v3/1600/1200',
      preview_url: 'https://picsum.photos/seed/v3/400/300',
      notes: 'Warmer lighting and lifestyle props added.',
      created_at: '2024-11-27T14:00:00Z',
      created_by_name: 'Render Vault Team',
    },
    {
      id: 'ver_002',
      version_number: 2,
      status: 'rejected',
      output_url: 'https://picsum.photos/seed/v2/1600/1200',
      preview_url: 'https://picsum.photos/seed/v2/400/300',
      notes: 'Refined composition, enhanced grain detail.',
      created_at: '2024-11-25T11:00:00Z',
      created_by_name: 'Render Vault Team',
    },
    {
      id: 'ver_001',
      version_number: 1,
      status: 'rejected',
      output_url: 'https://picsum.photos/seed/v1/1600/1200',
      preview_url: 'https://picsum.photos/seed/v1/400/300',
      notes: 'Initial render based on brief.',
      created_at: '2024-11-22T09:00:00Z',
      created_by_name: 'Render Vault Team',
    },
  ],
};

export const demoImageComments: Record<string, ImageComment[]> = {
  img_001: [
    {
      id: 'com_001',
      version_number: 1,
      author_type: 'staff',
      author_name: 'Render Vault Team',
      body: 'Initial render. Looking for feedback on lighting and composition.',
      created_at: '2024-11-22T09:05:00Z',
    },
    {
      id: 'com_002',
      version_number: 1,
      author_type: 'customer',
      author_name: 'Client',
      body: 'Composition works. Can we enhance the grain and add lifestyle elements?',
      created_at: '2024-11-23T10:00:00Z',
    },
    {
      id: 'com_003',
      version_number: 2,
      author_type: 'staff',
      author_name: 'Render Vault Team',
      body: 'Version 2 ready with grain detail and composition tweaks.',
      created_at: '2024-11-25T11:05:00Z',
    },
    {
      id: 'com_004',
      version_number: 2,
      author_type: 'customer',
      author_name: 'Client',
      body: 'Better! Please warm up the light to late afternoon.',
      created_at: '2024-11-26T15:00:00Z',
    },
    {
      id: 'com_005',
      version_number: 3,
      author_type: 'staff',
      author_name: 'Render Vault Team',
      body: 'Version 3 now has warmer lighting and added lifestyle pieces.',
      created_at: '2024-11-27T14:05:00Z',
    },
  ],
};
