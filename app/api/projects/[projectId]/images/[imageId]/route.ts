import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { getSessionUser, unauthorizedResponse } from '@/lib/server-auth';
import type {
  ImageCommentRecord,
  ImageVersionRecord,
  ProjectImageRecord,
  ProjectRecord,
} from '@/lib/backend-types';
import type { ImageStatus } from '@/lib/status';

export const dynamic = 'force-dynamic';

function respondDbError(message: string, error?: unknown, status = 500) {
  const details = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : undefined;
  return NextResponse.json({ error: message, details }, { status });
}

function isValidImageStatus(value: string | null | undefined): value is ImageStatus {
  return ['draft', 'processing', 'delivered', 'needs_revision', 'approved', 'archived'].includes(String(value));
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ projectId: string; imageId: string }> }) {
  const resolved = await params;
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const admin = createSupabaseServiceRoleClient();

  const { data: image, error: imageError } = await admin
    .from('project_images')
    .select<ProjectImageRecord>('*')
    .eq('id', resolved.imageId)
    .single();
  if (imageError) return respondDbError('Image not found or database missing.', imageError, 404);

  const { data: project, error: projectError } = await admin
    .from('projects')
    .select<ProjectRecord>('id, name, user_id')
    .eq('id', image.project_id)
    .single();
  if (projectError || !project || project.user_id !== user.id) return unauthorizedResponse();

  const [versionsRes, commentsRes] = await Promise.all([
    admin
      .from('image_versions')
      .select<ImageVersionRecord>('*')
    .eq('image_id', resolved.imageId)
      .order('version_number', { ascending: false }),
    admin
      .from('image_comments')
      .select<ImageCommentRecord>('*')
    .eq('image_id', resolved.imageId)
      .order('created_at', { ascending: true }),
  ]);

  if (versionsRes.error) return respondDbError('Failed to load versions.', versionsRes.error);
  if (commentsRes.error) return respondDbError('Failed to load comments.', commentsRes.error);

  return NextResponse.json({
    project: { id: project.id, name: project.name },
    image,
    versions: versionsRes.data ?? [],
    comments: commentsRes.data ?? [],
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ projectId: string; imageId: string }> }) {
  const resolved = await params;
  const user = await getSessionUser(req);
  if (!user) return unauthorizedResponse();

  const payload = await req.json().catch(() => null);
  const status = payload?.status as string | undefined;
  if (!isValidImageStatus(status ?? null)) {
    return NextResponse.json({ error: 'Invalid image status' }, { status: 400 });
  }

  const admin = createSupabaseServiceRoleClient();
  const { data: projectCheck } = await admin.from('projects').select('id,user_id').eq('id', resolved.projectId).single();
  if (!projectCheck || projectCheck.user_id !== user.id) return unauthorizedResponse();

  const { data, error } = await admin
    .from('project_images')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', resolved.imageId)
    .select<ProjectImageRecord>()
    .single();

  if (error) return respondDbError('Failed to update image status.', error);

  return NextResponse.json({ image: data });
}
