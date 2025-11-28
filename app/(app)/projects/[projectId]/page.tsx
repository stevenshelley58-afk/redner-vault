'use client';

export const dynamic = 'force-dynamic';

import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Image as ImageIcon, MessageSquare, Upload, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { TextArea } from '../../../../components/ui/TextArea';
import { StatusPill } from '../../../../components/app/StatusPill';
import { formatDate, formatRelativeTime } from '../../../../lib/date';
import {
  demoAssets,
  demoImages,
  demoNotes,
  demoProject,
  type ProjectAsset,
  type ProjectNote,
} from '../../../../lib/demo-data';

type AssetTab = 'all' | ProjectAsset['type'];

const ASSET_TYPES: Record<ProjectAsset['type'], { label: string; tone: string }> = {
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

function AssetGrid({ assets, onUpload }: { assets: ProjectAsset[]; onUpload?: (file: File) => void }) {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
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

function ImagesGrid({ projectId }: { projectId: string }) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {demoImages.map((image) => (
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
      <button className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-ghost bg-white/60 p-4 text-text-subtle transition hover:border-accent hover:text-accent">
        <Plus className="h-5 w-5" />
        Add output image
      </button>
    </div>
  );
}

function NotesSection({ notes, onAdd }: { notes: ProjectNote[]; onAdd: (body: string) => void }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
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
        <Button onClick={handleSubmit} className="self-start px-3 py-2 text-sm" iconLeft={<MessageSquare className="h-4 w-4" />}>
          Send
        </Button>
      </div>
    </div>
  );
}

export default function ProjectWorkspacePage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const [notes, setNotes] = useState<ProjectNote[]>(demoNotes);
  const [assets, setAssets] = useState<ProjectAsset[]>(demoAssets);
  const projectId = params?.projectId ?? demoProject.id;

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
        <StatusPill kind="project" status={demoProject.status} />
      </div>

      <div className="rounded-3xl border border-border-ghost bg-bg-paper p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-text-subtle">
              <span className="uppercase tracking-wide text-[11px] text-text-subtle">Project</span>
              <span className="text-[11px] text-text-subtle/70">Billing {demoProject.billing_period_label}</span>
            </div>
            <h1 className="text-2xl font-semibold text-text-ink">{demoProject.name}</h1>
            <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs text-text-subtle">
              <Calendar className="h-4 w-4 text-text-subtle/80" />
              Due {formatDate(demoProject.due_date)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" iconLeft={<Upload className="h-4 w-4" />}>
              Upload assets
            </Button>
            <Button>New image</Button>
          </div>
        </div>
        <div className="mt-4 grid gap-4 rounded-2xl border border-border-ghost bg-surface p-4 md:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-subtle">Brief</h4>
            <p className="mt-2 whitespace-pre-line text-sm text-text-ink/90">{demoProject.brief}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-subtle">Deliverables</h4>
            <p className="mt-2 rounded-xl bg-bg-paper px-3 py-2 text-sm text-text-ink/90">{demoProject.agreed_deliverables}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SectionCard title="Assets" icon={<Upload className="h-5 w-5 text-text-ink" />}>
          <AssetGrid
            assets={assets}
            onUpload={(file) =>
              setAssets((prev) => [
                {
                  id: `upload_${Date.now()}`,
                  type: 'other',
                  label: file.name,
                  file_thumbnail_url: URL.createObjectURL(file),
                  created_at: new Date().toISOString(),
                },
                ...prev,
              ])
            }
          />
        </SectionCard>

        <SectionCard
          title="Output images"
          icon={<ImageIcon className="h-5 w-5 text-text-ink" />}
          action={
            <Button variant="secondary" className="px-3 py-1.5 text-sm" iconLeft={<Plus className="h-4 w-4" />}>
              Add image
            </Button>
          }
        >
          <ImagesGrid projectId={projectId} />
        </SectionCard>

        <SectionCard title="Notes" icon={<MessageSquare className="h-5 w-5 text-text-ink" />}>
          <NotesSection
            notes={notes}
            onAdd={(body) =>
              setNotes((prev) => [
                {
                  id: crypto.randomUUID(),
                  author_type: 'customer',
                  author_name: 'You',
                  body,
                  created_at: new Date().toISOString(),
                },
                ...prev,
              ])
            }
          />
        </SectionCard>
      </div>
    </div>
  );
}
