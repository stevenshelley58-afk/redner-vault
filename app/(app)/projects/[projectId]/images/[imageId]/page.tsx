'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Check, Download, Maximize, MessageSquare, RotateCcw, Send, ZoomIn, ZoomOut } from 'lucide-react';
import { StatusPill } from '../../../../../../components/app/StatusPill';
import { Button } from '../../../../../../components/ui/Button';
import { TextArea } from '../../../../../../components/ui/TextArea';
import { formatDateTime, formatRelativeTime } from '../../../../../../lib/date';
import type {
  ImageCommentRecord,
  ImageVersionRecord,
  ProjectImageRecord,
} from '../../../../../../lib/backend-types';
import type { ImageStatus } from '../../../../../../lib/status';

type Annotation = {
  id: string;
  tool: 'pen';
  points: { x: number; y: number }[];
  note: string;
  version_number: number;
  color: string;
  hidden?: boolean;
};

type AnnotationDraft = {
  tool: Annotation['tool'];
  points: { x: number; y: number }[];
};

const COLORS = ['#0071E3', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#0ea5e9', '#ec4899'];

function VersionSelector({
  versions,
  activeId,
  onSelect,
}: {
  versions: ImageVersionRecord[];
  activeId?: string;
  onSelect: (version: ImageVersionRecord) => void;
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
  setDraft,
  draft,
  onEraseLast,
  onPlaceDraft,
  showAnnotations,
  color,
}: {
  version?: ImageVersionRecord;
  onDownload: () => void;
  onFullscreen: () => void;
  annotations: Annotation[];
  setDraft: (d: AnnotationDraft | null) => void;
  draft: AnnotationDraft | null;
  onEraseLast: () => void;
  onPlaceDraft: () => void;
  showAnnotations: boolean;
  color: string;
}) {
  const [zoom, setZoom] = useState(1);
  const isDrawing = useRef(false);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const reset = () => {
    setZoom(1);
  };

  const startDrawing = (clientX: number, clientY: number, target: HTMLDivElement) => {
    if (!version) return;
    const bounds = target.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width;
    const y = (clientY - bounds.top) / bounds.height;
    setDraft({ tool: 'pen', points: [{ x, y }] });
    isDrawing.current = true;
  };

  const continueDrawing = (clientX: number, clientY: number, target: HTMLDivElement) => {
    if (!isDrawing.current || !draft) return;
    const bounds = target.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width;
    const y = (clientY - bounds.top) / bounds.height;
    setDraft({ ...draft, points: [...draft.points, { x, y }] });
  };

  const stopDrawing = () => {
    if (draft && isDrawing.current) {
      onPlaceDraft();
    }
    isDrawing.current = false;
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    startDrawing(e.clientX, e.clientY, e.currentTarget);
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    continueDrawing(e.clientX, e.clientY, e.currentTarget);
  };

  const onMouseUp = () => stopDrawing();

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    startDrawing(touch.clientX, touch.clientY, e.currentTarget);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    continueDrawing(touch.clientX, touch.clientY, e.currentTarget);
  };

  const onTouchEnd = () => stopDrawing();

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

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border-ghost bg-bg-paper px-3 py-2 text-sm text-text-subtle">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">Annotate</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-subtle">Draw to add</span>
          <button
            onClick={onEraseLast}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-ghost bg-white text-text-ink transition hover:bg-surface"
            title="Erase last"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-subtle">Next color</span>
          <span className="h-6 w-6 rounded-full border border-border-ghost" style={{ backgroundColor: color }} />
        </div>
      </div>

      <div
        className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-border-ghost bg-black cursor-crosshair"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={stopDrawing}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={version.output_url}
          alt={`Version ${version.version_number}`}
          className="select-none object-contain"
          draggable={false}
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 80ms ease',
          }}
        />
        {showAnnotations && (
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            {annotations
              .filter((ann) => !ann.hidden)
              .map((ann) => {
                const d = ann.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 1000} ${p.y * 1000}`).join(' ');
                return <path key={ann.id} d={d} stroke={ann.color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
              })}
            {draft && (
              <path
                d={draft.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 1000} ${p.y * 1000}`).join(' ')}
                stroke={color}
                strokeWidth={2}
                fill="none"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            )}
          </svg>
        )}
      </div>
    </div>
  );
}

function CommentsPanel({
  comments,
  activeVersion,
  onAdd,
}: {
  comments: ImageCommentRecord[];
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
  const [projectName, setProjectName] = useState('');
  const [image, setImage] = useState<ProjectImageRecord | null>(null);
  const [versions, setVersions] = useState<ImageVersionRecord[]>([]);
  const [activeVersion, setActiveVersion] = useState<ImageVersionRecord | undefined>(undefined);
  const [comments, setComments] = useState<ImageCommentRecord[]>([]);
  const [imageStatus, setImageStatus] = useState<ImageStatus>('draft');
  const [fullscreen, setFullscreen] = useState(false);
  const [annotationsByVersion, setAnnotationsByVersion] = useState<Record<number, Annotation[]>>({});
  const [draft, setDraft] = useState<AnnotationDraft | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const annotations = annotationsByVersion[activeVersion?.version_number ?? 0] ?? [];
  const nextColor = COLORS[annotations.length % COLORS.length];

  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/projects/${params.projectId}/images/${params.imageId}`);
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Unable to load image');
      setLoading(false);
      return;
    }
    setProjectName(data.project?.name ?? '');
    setImage(data.image);
    const sorted = (data.versions ?? []).sort((a: ImageVersionRecord, b: ImageVersionRecord) => b.version_number - a.version_number);
    setVersions(sorted);
    setActiveVersion(sorted[0]);
    setComments(data.comments ?? []);
    setImageStatus(data.image?.status ?? 'draft');
    setError(null);
    setLoading(false);
  }, [params.imageId, params.projectId, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleAddComment = async (body: string) => {
    if (!activeVersion) return;
    const res = await fetch(`/api/projects/${params.projectId}/images/${params.imageId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, version_number: activeVersion.version_number }),
    });
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Unable to add comment');
      return;
    }
    setComments((prev) => [...prev, data.comment]);
  };

  const updateStatus = async (status: ImageStatus) => {
    const res = await fetch(`/api/projects/${params.projectId}/images/${params.imageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Unable to update status');
      return;
    }
    setImageStatus(data.image.status);
    setImage(data.image);
  };

  const handleApprove = () => updateStatus('approved');

  const handleRequestRevision = () => {
    updateStatus('needs_revision');
    if (activeVersion) {
      handleAddComment('Requesting revision on this version.');
    }
  };

  const canApprove =
    activeVersion && (activeVersion.status === 'delivered' || activeVersion.status === 'candidate');
  const canRequestRevision = activeVersion && activeVersion.status !== 'approved';

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="rounded-2xl border border-border-ghost bg-bg-paper p-6 text-sm text-text-subtle">
          Loading image...
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="mx-auto max-w-4xl space-y-3">
        <button
          onClick={() => router.push(`/projects/${params.projectId}`)}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-subtle transition hover:text-text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </button>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">
          {error ?? 'Image not found.'}
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-text-subtle">Project: {projectName || params.projectId}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-subtle">
            <span>Last updated {formatDateTime(image.updated_at)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <VersionSelector versions={versions} activeId={activeVersion?.id} onSelect={setActiveVersion} />
          <div className="flex flex-col gap-3">
            <ImageViewport
              key={activeVersion?.id ?? 'no-version'}
              version={activeVersion}
              onDownload={() => activeVersion && window.open(activeVersion.output_url, '_blank')}
              onFullscreen={() => setFullscreen(true)}
              annotations={annotations}
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
              showAnnotations={showAnnotations}
              color={nextColor}
            />

            {draft && (
              <div className="rounded-2xl border border-border-ghost bg-bg-paper p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-semibold text-text-ink">
                  <span>Add note to annotation</span>
                  <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => { setDraft(null); setNoteDraft(''); }}>
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
                          color: nextColor,
                          hidden: false,
                        },
                      ],
                    };
                  });
                      setDraft(null);
                      setNoteDraft('');
                    }}
                    disabled={!noteDraft.trim()}
                  >
                    Save annotation
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border-ghost bg-bg-paper px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-ink">
                  <MessageSquare className="h-4 w-4 text-text-subtle" />
                  Annotations
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAnnotations((v) => !v)}
                    className="text-xs text-text-subtle underline"
                  >
                    {showAnnotations ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              {annotations.length === 0 ? (
                <p className="text-sm text-text-subtle">No annotations yet.</p>
              ) : (
                <div className="space-y-2">
                  {annotations.map((ann, idx) => (
                    <div key={ann.id} className="flex items-start justify-between gap-3 rounded-lg border border-border-ghost bg-white px-3 py-2 text-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full border border-border-ghost" style={{ backgroundColor: ann.color }} />
                          <span className="font-medium">#{idx + 1}</span>
                          {ann.hidden && <span className="text-[11px] text-text-subtle">(hidden)</span>}
                        </div>
                        <span className="text-text-subtle/80">{ann.note}</span>
                      </div>
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-xs text-text-subtle"
                        onClick={() => {
                          if (!activeVersion) return;
                          setAnnotationsByVersion((prev) => {
                            const existing = prev[activeVersion.version_number] ?? [];
                            return {
                              ...prev,
                              [activeVersion.version_number]: existing.map((a) =>
                                a.id === ann.id ? { ...a, hidden: !a.hidden } : a,
                              ),
                            };
                          });
                        }}
                      >
                        {ann.hidden ? 'Show' : 'Hide'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
