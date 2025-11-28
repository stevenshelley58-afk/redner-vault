'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  Download,
  Maximize,
  MessageSquare,
  Pencil,
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

type Annotation = {
  id: string;
  tool: 'pen' | 'arrow' | 'circle';
  points: { x: number; y: number }[];
  note: string;
  version_number: number;
};

type AnnotationDraft = {
  tool: Annotation['tool'];
  points: { x: number; y: number }[];
};

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
  annotations,
  tool,
  setTool,
  setDraft,
  draft,
  onEraseLast,
  onPlaceDraft,
}: {
  version?: ImageVersion;
  onDownload: () => void;
  onFullscreen: () => void;
  annotations: Annotation[];
  tool: Annotation['tool'] | 'select' | 'eraser';
  setTool: (t: Annotation['tool'] | 'select' | 'eraser') => void;
  setDraft: (d: AnnotationDraft | null) => void;
  draft: AnnotationDraft | null;
  onEraseLast: () => void;
  onPlaceDraft: () => void;
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
    if (tool === 'select' && zoom > 1) {
      setDragging(true);
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      return;
    }
    if (!version) return;
    if (tool === 'pen' || tool === 'arrow' || tool === 'circle') {
      const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width;
      const y = (e.clientY - bounds.top) / bounds.height;
      setDraft({ tool, points: [{ x, y }] });
    }
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
      return;
    }
    if (draft) {
      const bounds = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const x = (e.clientX - bounds.left) / bounds.width;
      const y = (e.clientY - bounds.top) / bounds.height;
      if (draft.tool === 'pen') {
        setDraft({ ...draft, points: [...draft.points, { x, y }] });
      } else {
        setDraft({ ...draft, points: [draft.points[0], { x, y }] });
      }
    }
  };

  const endDrag = () => {
    if (draft) {
      onPlaceDraft();
    }
    setDragging(false);
  };

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

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border-ghost bg-bg-paper px-3 py-2 text-sm text-text-subtle">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">Annotate</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tool === 'pen' ? 'border-accent bg-accent/10 text-accent' : 'border-border-ghost bg-white text-text-ink'} transition`}
            title="Freehand"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTool('arrow')}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tool === 'arrow' ? 'border-accent bg-accent/10 text-accent' : 'border-border-ghost bg-white text-text-ink'} transition`}
            title="Arrow"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tool === 'circle' ? 'border-accent bg-accent/10 text-accent' : 'border-border-ghost bg-white text-text-ink'} transition`}
            title="Circle"
          >
            <Circle className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setTool('eraser');
              onEraseLast();
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${tool === 'eraser' ? 'border-accent bg-accent/10 text-accent' : 'border-border-ghost bg-white text-text-ink'} transition`}
            title="Erase last"
          >
            🧽
          </button>
          <button
            onClick={() => setTool('select')}
            className={`flex h-9 px-3 items-center justify-center rounded-lg border ${tool === 'select' ? 'border-accent bg-accent/10 text-accent' : 'border-border-ghost bg-white text-text-ink'} transition text-xs`}
            title="Pan"
          >
            Pan
          </button>
        </div>
      </div>

      <div
        className={`relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-border-ghost bg-black ${zoom > 1 ? 'cursor-grab' : 'cursor-crosshair'}`}
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
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          {annotations.map((ann) => {
            if (ann.tool === 'pen') {
              const d = ann.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 1000} ${p.y * 1000}`).join(' ');
              return <path key={ann.id} d={d} stroke="#0071E3" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
            }
            if (ann.tool === 'arrow') {
              const [start, end] = ann.points;
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const angle = Math.atan2(dy, dx);
              const arrowLen = 18;
              const arrowAngle = Math.PI / 7;
              const x2 = end.x * 1000;
              const y2 = end.y * 1000;
              const line = `M ${start.x * 1000} ${start.y * 1000} L ${x2} ${y2}`;
              const arrow1 = `L ${x2 - arrowLen * Math.cos(angle - arrowAngle)} ${y2 - arrowLen * Math.sin(angle - arrowAngle)}`;
              const arrow2 = `M ${x2} ${y2} L ${x2 - arrowLen * Math.cos(angle + arrowAngle)} ${y2 - arrowLen * Math.sin(angle + arrowAngle)}`;
              return (
                <g key={ann.id} stroke="#0071E3" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d={line} />
                  <path d={arrow1} />
                  <path d={arrow2} />
                </g>
              );
            }
            if (ann.tool === 'circle') {
              const [start, end] = ann.points;
              const rx = (end.x - start.x) * 1000;
              const ry = (end.y - start.y) * 1000;
              const r = Math.sqrt(rx * rx + ry * ry);
              return <circle key={ann.id} cx={start.x * 1000} cy={start.y * 1000} r={r} stroke="#0071E3" strokeWidth={3} fill="none" />;
            }
            return null;
          })}
          {draft && (
            <>
              {draft.tool === 'pen' && (
                <path
                  d={draft.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 1000} ${p.y * 1000}`).join(' ')}
                  stroke="#0071E3"
                  strokeWidth={2}
                  fill="none"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              )}
              {draft.tool === 'arrow' && draft.points.length === 2 && (
                <line
                  x1={draft.points[0].x * 1000}
                  y1={draft.points[0].y * 1000}
                  x2={draft.points[1].x * 1000}
                  y2={draft.points[1].y * 1000}
                  stroke="#0071E3"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              )}
              {draft.tool === 'circle' && draft.points.length === 2 && (
                <circle
                  cx={draft.points[0].x * 1000}
                  cy={draft.points[0].y * 1000}
                  r={Math.sqrt(
                    Math.pow((draft.points[1].x - draft.points[0].x) * 1000, 2) +
                      Math.pow((draft.points[1].y - draft.points[0].y) * 1000, 2),
                  )}
                  stroke="#0071E3"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  fill="none"
                />
              )}
            </>
          )}
        </svg>
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
  const fallbackImage = demoImages[0];
  const image = demoImages.find((img) => img.id === params.imageId) ?? fallbackImage;
  const versions = useMemo(
    () => (demoImageVersions[image.id] ?? []).sort((a, b) => b.version_number - a.version_number),
    [image.id],
  );
  const [activeVersion, setActiveVersion] = useState<ImageVersion | undefined>(versions[0]);
  const [comments, setComments] = useState<ImageComment[]>(demoImageComments[image.id] ?? []);
  const [imageStatus, setImageStatus] = useState<ImageStatus>(image?.status ?? 'draft');
  const [fullscreen, setFullscreen] = useState(false);
  const [annotationsByVersion, setAnnotationsByVersion] = useState<Record<number, Annotation[]>>({});
  const [tool, setTool] = useState<Annotation['tool'] | 'select' | 'eraser'>('select');
  const [draft, setDraft] = useState<AnnotationDraft | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  const annotations = annotationsByVersion[activeVersion?.version_number ?? 0] ?? [];

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
          <div className="flex flex-col gap-3">
            <ImageViewport
              version={activeVersion}
              onDownload={() => activeVersion && window.open(activeVersion.output_url, '_blank')}
              onFullscreen={() => setFullscreen(true)}
              annotations={annotations}
              tool={tool}
              setTool={setTool}
              setDraft={setDraft}
              draft={draft}
              onEraseLast={() => {
                if (!activeVersion) return;
                setAnnotationsByVersion((prev) => {
                  const existing = prev[activeVersion.version_number] ?? [];
                  return { ...prev, [activeVersion.version_number]: existing.slice(0, -1) };
                });
              }}
              onPlaceDraft={() => {}}
            />

            {draft && (
              <div className="rounded-2xl border border-border-ghost bg-bg-paper p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-semibold text-text-ink">
                  <span>Add note to annotation</span>
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => { setDraft(null); setNoteDraft(''); setTool('select'); }}>
                    Cancel
                  </Button>
                </div>
                <TextArea
                  placeholder="Describe your note..."
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      if (!activeVersion || !draft) return;
                      if (!noteDraft.trim()) return;
                      setAnnotationsByVersion((prev) => {
                        const existing = prev[activeVersion.version_number] ?? [];
                        return {
                          ...prev,
                          [activeVersion.version_number]: [
                            ...existing,
                            {
                              id: crypto.randomUUID(),
                              tool: draft.tool,
                              points: draft.points,
                              note: noteDraft.trim(),
                              version_number: activeVersion.version_number,
                            },
                          ],
                        };
                      });
                      setDraft(null);
                      setNoteDraft('');
                      setTool('select');
                    }}
                    disabled={!noteDraft.trim()}
                  >
                    Save annotation
                  </Button>
                </div>
              </div>
            )}

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
