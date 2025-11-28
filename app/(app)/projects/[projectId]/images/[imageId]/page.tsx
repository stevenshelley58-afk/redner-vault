'use client';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Download,
  Maximize,
  MessageSquare,
  RotateCcw,
  Send,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { StatusPill } from '../../../../../../components/app/StatusPill';
import { Button } from '../../../../../../components/ui/Button';
import { TextArea } from '../../../../../../components/ui/TextArea';
import { formatDateTime, formatRelativeTime } from '../../../../../../lib/date';
import {
  demoImageComments,
  demoImageVersions,
  demoImages,
  demoProject,
  type ImageComment,
  type ImageVersion,
} from '../../../../../../lib/demo-data';
import type { ImageStatus } from '../../../../../../lib/status';

function VersionSelector({
  versions,
  activeId,
  onSelect,
}: {
  versions: ImageVersion[];
  activeId?: string;
  onSelect: (version: ImageVersion) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {versions.map((version) => (
        <button
          key={version.id}
          onClick={() => onSelect(version)}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
            activeId === version.id
              ? 'border-accent/40 bg-accent/10 text-accent'
              : 'border-border-ghost bg-surface text-text-subtle'
          }`}
        >
          <span className="font-semibold">v{version.version_number}</span>
          <StatusPill kind="version" status={version.status} />
        </button>
      ))}
    </div>
  );
}

function ImageViewport({
  version,
  onDownload,
  onFullscreen,
}: {
  version?: ImageVersion;
  onDownload: () => void;
  onFullscreen: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [version?.id]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const reset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    setDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const endDrag = () => setDragging(false);

  if (!version) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl border border-border-ghost bg-surface text-text-subtle">
        No version selected
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-2xl border border-border-ghost bg-bg-paper px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-text-subtle">
          <button
            onClick={handleZoomOut}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-ghost bg-white text-text-ink hover:bg-surface"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-text-ink">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-ghost bg-white text-text-ink hover:bg-surface"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={reset}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-ghost bg-white text-text-ink hover:bg-surface"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-ghost bg-white text-text-ink hover:bg-surface"
          >
            <Maximize className="h-4 w-4" />
          </button>
          <Button variant="secondary" className="px-3 py-2 text-sm" iconLeft={<Download className="h-4 w-4" />} onClick={onDownload}>
            Download
          </Button>
        </div>
      </div>

      <div
        className={`relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-border-ghost bg-black ${zoom > 1 ? 'cursor-grab' : 'cursor-default'}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <img
          src={version.output_url}
          alt={`Version ${version.version_number}`}
          className="select-none object-contain"
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: dragging ? 'none' : 'transform 80ms ease',
          }}
        />
      </div>
    </div>
  );
}

function CommentsPanel({
  comments,
  activeVersion,
  onAdd,
}: {
  comments: ImageComment[];
  activeVersion?: number;
  onAdd: (body: string) => void;
}) {
  const [value, setValue] = useState('');
  const listRef = useRef<HTMLDivElement | null>(null);
  const versionComments = useMemo(
    () => comments.filter((c) => c.version_number === activeVersion),
    [comments, activeVersion],
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [versionComments.length]);

  const submit = () => {
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue('');
  };

  return (
    <div className="flex h-full min-h-[360px] flex-col rounded-2xl border border-border-ghost bg-bg-paper">
      <div className="flex items-center gap-2 border-b border-border-ghost px-4 py-3 text-sm font-semibold text-text-ink">
        <MessageSquare className="h-4 w-4 text-text-subtle" />
        Comments {activeVersion ? `(v${activeVersion})` : ''}
      </div>
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {versionComments.length === 0 ? (
          <p className="text-sm text-text-subtle">No comments yet.</p>
        ) : (
          versionComments.map((comment) => (
            <div
              key={comment.id}
              className={`rounded-xl border border-border-ghost bg-white p-3 text-sm ${
                comment.author_type === 'staff' ? 'border-l-4 border-l-accent' : ''
              }`}
            >
              <div className="flex items-center justify-between text-xs text-text-subtle">
                <span className="font-semibold text-text-ink">{comment.author_name}</span>
                <span>{formatRelativeTime(comment.created_at)}</span>
              </div>
              <p className="mt-1 text-text-ink/90">{comment.body}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex items-end gap-2 border-t border-border-ghost bg-white px-3 py-3">
        <TextArea
          placeholder="Add a comment..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          className="min-h-[60px]"
        />
        <Button onClick={submit} className="self-start px-3 py-2 text-sm" iconLeft={<Send className="h-4 w-4" />}>
          Send
        </Button>
      </div>
    </div>
  );
}

export default function ImageDetailPage({ params }: { params: { projectId: string; imageId: string } }) {
  const router = useRouter();
  const image = demoImages.find((img) => img.id === params.imageId);
  const versions = useMemo(
    () => (demoImageVersions[params.imageId] ?? []).sort((a, b) => b.version_number - a.version_number),
    [params.imageId],
  );
  const [activeVersion, setActiveVersion] = useState<ImageVersion | undefined>(versions[0]);
  const [comments, setComments] = useState<ImageComment[]>(demoImageComments[params.imageId] ?? []);
  const [imageStatus, setImageStatus] = useState<ImageStatus>(image?.status ?? 'draft');
  const [fullscreen, setFullscreen] = useState(false);

  if (!image) {
    return (
      <div className="mx-auto max-w-4xl space-y-3">
        <button
          onClick={() => router.push(`/projects/${params.projectId}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-subtle transition hover:text-text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </button>
        <div className="rounded-2xl border border-border-ghost bg-bg-paper p-6">
          <p className="text-sm text-text-ink">Image not found.</p>
        </div>
      </div>
    );
  }

  const handleAddComment = (body: string) => {
    if (!activeVersion) return;
    setComments((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        version_number: activeVersion.version_number,
        author_type: 'customer',
        author_name: 'You',
        body,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleApprove = () => {
    setImageStatus('approved');
  };

  const handleRequestRevision = () => {
    setImageStatus('needs_revision');
    if (activeVersion) {
      handleAddComment('Requesting revision on this version.');
    }
  };

  const canApprove =
    activeVersion && (activeVersion.status === 'delivered' || activeVersion.status === 'candidate');
  const canRequestRevision = activeVersion && activeVersion.status !== 'approved';

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/projects/${params.projectId}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-subtle transition hover:text-text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </button>
        <StatusPill kind="image" status={imageStatus} />
      </div>

      <div className="rounded-3xl border border-border-ghost bg-bg-paper p-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-text-subtle">Image</p>
            <h1 className="text-xl font-semibold text-text-ink">{image.title}</h1>
            <p className="text-sm text-text-subtle">Project: {demoProject.name}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-subtle">
            <span>Last updated {formatDateTime(image.updated_at)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <VersionSelector versions={versions} activeId={activeVersion?.id} onSelect={setActiveVersion} />
          <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
            <ImageViewport
              version={activeVersion}
              onDownload={() => activeVersion && window.open(activeVersion.output_url, '_blank')}
              onFullscreen={() => setFullscreen(true)}
            />
            <CommentsPanel
              comments={comments}
              activeVersion={activeVersion?.version_number}
              onAdd={handleAddComment}
            />
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-border-ghost bg-surface px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-text-subtle">
              <span className="text-xs uppercase tracking-wide text-text-subtle">Status</span>
              <StatusPill kind="image" status={imageStatus} />
            </div>
            <div className="flex items-center gap-2">
              {canRequestRevision && (
                <Button variant="secondary" onClick={handleRequestRevision} iconLeft={<AlertTriangle className="h-4 w-4" />}>
                  Request revision
                </Button>
              )}
              {canApprove && (
                <Button onClick={handleApprove} iconLeft={<Check className="h-4 w-4" />}>
                  Approve image
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {fullscreen && activeVersion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setFullscreen(false)}
        >
          <img
            src={activeVersion.output_url}
            alt={`Version ${activeVersion.version_number}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}
