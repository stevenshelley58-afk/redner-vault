'use client';

export const dynamic = 'force-dynamic';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Image as ImageIcon, MessageSquare, Upload, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { TextArea } from '../../../../components/ui/TextArea';
import { StatusPill } from '../../../../components/app/StatusPill';
import { formatDate, formatRelativeTime } from '../../../../lib/date';
import type {
  ProjectAssetRecord,
  ProjectNoteRecord,
  ProjectRecord,
  ProjectImageRecord,
} from '../../../../lib/backend-types';

type AssetTab = 'all' | ProjectAssetRecord['type'];

const ASSET_TYPES: Record<ProjectAssetRecord['type'], { label: string; tone: string }> = {
  source_image: { label: 'Source', tone: 'bg-blue-50 text-blue-700' },
  reference_image: { label: 'Reference', tone: 'bg-purple-50 text-purple-700' },
  material_doc: { label: 'Materials', tone: 'bg-emerald-50 text-emerald-700' },
  inspiration: { label: 'Inspiration', tone: 'bg-pink-50 text-pink-700' },
  other: { label: 'Other', tone: 'bg-slate-100 text-slate-700' },
};

function SectionCard({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-ghost bg-bg-paper p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-text-ink">{icon}</div>
          <h3 className="text-base font-semibold text-text-ink">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function AssetGrid({
  assets,
  onUpload,
  inputId = 'asset-upload-input',
}: {
  assets: ProjectAssetRecord[];
  onUpload?: (file: File) => Promise<void>;
  inputId?: string;
}) {
  const [active, setActive] = useState<AssetTab>('all');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tabs: AssetTab[] = ['all', 'source_image', 'reference_image', 'material_doc', 'inspiration', 'other'];
  const counts = useMemo(() => {
    const base: Record<AssetTab, number> = { all: assets.length, source_image: 0, reference_image: 0, material_doc: 0, inspiration: 0, other: 0 };
    assets.forEach((asset) => {
      base[asset.type] += 1;
    });
    return base;
  }, [assets]);

  const filtered = active === 'all' ? assets : assets.filter((a) => a.type === active);

  const triggerUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      await onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} id={inputId} type="file" className="hidden" onChange={handleFileChange} />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs
          .filter((tab) => counts[tab] > 0 || tab === 'all')
          .map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`inline-flex items-center gap-2 rounded-full border border-border-ghost px-3 py-1.5 text-sm text-text-subtle transition hover:bg-surface ${
                active === tab ? 'border-accent/30 bg-accent/10 text-accent' : ''
              }`}
            >
              {tab === 'all' ? 'All' : ASSET_TYPES[tab].label}
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-text-subtle">
                {counts[tab]}
              </span>
            </button>
          ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border-ghost bg-surface/60 p-4 text-center text-sm text-text-subtle">
            No assets yet. Upload to get started.
          </div>
        )}
        {filtered.map((asset) => (
          <div key={asset.id} className="flex flex-col gap-2 rounded-xl border border-border-ghost bg-surface p-3 shadow-sm">
            {asset.file_thumbnail_url ? (
              <img
                src={asset.file_thumbnail_url}
                alt={asset.label}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-border-ghost text-text-subtle">
                <FileText className="h-6 w-6" />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="truncate text-sm font-medium text-text-ink">{asset.label}</span>
              <span
                className={`w-fit rounded-full px-2 py-1 text-[11px] font-semibold ${
                  ASSET_TYPES[asset.type]?.tone ?? 'bg-slate-100 text-slate-700'
                }`}
              >
                {ASSET_TYPES[asset.type]?.label ?? 'Asset'}
              </span>
            </div>
          </div>
        ))}
        <button
          onClick={triggerUpload}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-ghost bg-white/70 p-4 text-text-subtle transition hover:border-accent hover:text-accent"
        >
          <Upload className="h-5 w-5" />
          <span className="text-sm font-medium">Upload asset</span>
        </button>
      </div>
    </div>
  );
}

function ImagesGrid({
  projectId,
  images,
  onUploadImage,
  loading,
  inputId = 'image-upload-input',
}: {
  projectId: string;
  images: ProjectImageRecord[];
  onUploadImage?: (file: File) => Promise<void>;
  loading?: boolean;
  inputId?: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerUpload = () => fileInputRef.current?.click();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadImage) {
      await onUploadImage(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input ref={fileInputRef} id={inputId} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {loading && (
          <div className="col-span-full rounded-xl border border-border-ghost bg-surface p-4 text-center text-sm text-text-subtle">
            Loading images...
          </div>
        )}
        {!loading && images.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-border-ghost bg-surface p-4 text-center text-sm text-text-subtle">
            No images yet. Upload your first render.
          </div>
        )}
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => router.push(`/projects/${projectId}/images/${image.id}`)}
            className="group flex flex-col overflow-hidden rounded-xl border border-border-ghost bg-surface text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {image.preview_url ? (
              <img src={image.preview_url} alt={image.title} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface text-text-subtle">
                <ImageIcon className="h-6 w-6" />
                <span className="ml-2 text-sm">Processing…</span>
              </div>
            )}
            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-sm font-semibold text-text-ink">{image.title}</h4>
                <span className="rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold text-text-subtle">
                  v{image.latest_version || 1}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <StatusPill kind="image" status={image.status} />
                <span className="text-[11px] uppercase tracking-wide text-text-subtle/80">
                  {formatRelativeTime(image.updated_at)}
                </span>
              </div>
            </div>
          </button>
        ))}
        <button
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-ghost bg-white/60 p-4 text-text-subtle transition hover:border-accent hover:text-accent"
          onClick={triggerUpload}
        >
          <Plus className="h-5 w-5" />
          Add output image
        </button>
      </div>
    </div>
  );
}

function NotesSection({ notes, onAdd }: { notes: ProjectNoteRecord[]; onAdd: (body: string) => Promise<void> }) {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    setSubmitting(true);
    await onAdd(value.trim());
    setValue('');
    setSubmitting(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`rounded-xl border border-border-ghost bg-surface p-3 ${
              note.author_type === 'staff' ? 'border-l-4 border-l-accent' : ''
            }`}
          >
            <div className="flex items-center justify-between text-xs text-text-subtle">
              <span className="font-semibold text-text-ink">{note.author_name}</span>
              <span>{formatRelativeTime(note.created_at)}</span>
            </div>
            <p className="mt-1 text-sm text-text-ink/90">{note.body}</p>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-3">
        <TextArea
          placeholder="Add a note..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
        />
        <Button onClick={handleSubmit} className="self-start px-3 py-2 text-sm" disabled={submitting} iconLeft={<MessageSquare className="h-4 w-4" />}>
          {submitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
}

export default function ProjectWorkspacePage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const projectId = params?.projectId;
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [notes, setNotes] = useState<ProjectNoteRecord[]>([]);
  const [assets, setAssets] = useState<ProjectAssetRecord[]>([]);
  const [images, setImages] = useState<ProjectImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/projects/${projectId}`);
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Unable to load project');
      setLoading(false);
      return;
    }
    setProject(data.project);
    setAssets(data.assets ?? []);
    setNotes(data.notes ?? []);
    setImages(data.images ?? []);
    setLoading(false);
  }, [projectId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProject();
  }, [fetchProject]);

  const handleAddNote = async (body: string) => {
    const res = await fetch(`/api/projects/${projectId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body }),
    });
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Unable to add note');
      return;
    }
    setNotes((prev) => [data.note, ...prev]);
  };

  const handleUploadAsset = async (file: File) => {
    setUploadingAsset(true);
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`/api/projects/${projectId}/assets`, { method: 'POST', body: form });
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Upload failed');
    } else {
      setAssets((prev) => [data.asset, ...prev]);
    }
    setUploadingAsset(false);
  };

  const handleUploadImage = async (file: File) => {
    setUploadingImage(true);
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`/api/projects/${projectId}/images`, { method: 'POST', body: form });
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Unable to add image');
    } else {
      setImages((prev) => [data.image, ...prev]);
    }
    setUploadingImage(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="rounded-3xl border border-border-ghost bg-bg-paper p-6 shadow-sm text-sm text-text-subtle">
          Loading project...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-5xl space-y-3">
        <button
          onClick={() => router.push('/projects')}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-subtle transition hover:text-text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </button>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">
          {error ?? 'Project not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/projects')}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-subtle transition hover:text-text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </button>
        <StatusPill kind="project" status={project.status} />
      </div>

      <div className="rounded-3xl border border-border-ghost bg-bg-paper p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-text-subtle">
              <span className="uppercase tracking-wide text-[11px] text-text-subtle">Project</span>
              <span className="text-[11px] text-text-subtle/70">
                Billing {project.billing_period_label || '—'}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-text-ink">{project.name}</h1>
            {project.due_date && (
              <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs text-text-subtle">
                <Calendar className="h-4 w-4 text-text-subtle/80" />
                Due {formatDate(project.due_date)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              iconLeft={<Upload className="h-4 w-4" />}
              disabled={uploadingAsset}
              onClick={() => document.getElementById('asset-upload-input')?.click()}
            >
              Upload assets
            </Button>
            <Button onClick={() => document.getElementById('image-upload-input')?.click()}>
              New image
            </Button>
          </div>
        </div>
        <div className="mt-4 grid gap-4 rounded-2xl border border-border-ghost bg-surface p-4 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-subtle">Brief</h4>
            <p className="mt-2 whitespace-pre-line text-sm text-text-ink/90">{project.brief || 'No brief yet.'}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-subtle">Deliverables</h4>
            <p className="mt-2 rounded-xl bg-bg-paper px-3 py-2 text-sm text-text-ink/90">
              {project.agreed_deliverables || 'Add deliverables for this project.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionCard title="Assets" icon={<Upload className="h-5 w-5 text-text-ink" />}>
          <AssetGrid assets={assets} onUpload={handleUploadAsset} />
          {uploadingAsset && <p className="text-xs text-text-subtle mt-2">Uploading...</p>}
        </SectionCard>

        <SectionCard
          title="Output images"
          icon={<ImageIcon className="h-5 w-5 text-text-ink" />}
          action={
            <Button variant="secondary" className="px-3 py-1.5 text-sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => document.getElementById('image-upload-trigger')?.click()}>
              Add image
            </Button>
          }
        >
          <ImagesGrid projectId={projectId} images={images} onUploadImage={handleUploadImage} loading={uploadingImage} />
        </SectionCard>

        <SectionCard title="Notes" icon={<MessageSquare className="h-5 w-5 text-text-ink" />}>
          <NotesSection
            notes={notes}
            onAdd={handleAddNote}
          />
        </SectionCard>
      </div>
    </div>
  );
}
