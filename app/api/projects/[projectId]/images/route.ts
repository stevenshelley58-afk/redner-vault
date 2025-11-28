import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { ensurePublicBucket } from '@/lib/storage';
import { getSessionUser, unauthorizedResponse } from '@/lib/server-auth';
import type { ProjectImageRecord, ImageVersionRecord } from '@/lib/backend-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function respondDbError(message: string, error?: unknown, status = 500) {
  const details = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : undefined;
  return NextResponse.json({ error: message, details }, { status });
}

export async function POST(req: NextRequest, { params }: { params: { projectId: string } | Promise<{ projectId: string }> }) {
  const resolved = await params;
  const user = await getSessionUser(req);
  if (!user) return unauthorizedResponse();

  const contentType = req.headers.get('content-type') || '';
  const admin = createSupabaseServiceRoleClient();

  let title = '';
  let previewUrl: string | null = null;
  let outputUrl: string | null = null;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('file');
    title = (form.get('title') as string | null) || '';

    if (file instanceof File) {
      const bucket = await ensurePublicBucket('project-outputs');
      const safeName = file.name.replace(/\s+/g, '-');
      const path = `${user.id}/${params.projectId}/${Date.now()}-${safeName}`;
      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await bucket.upload(path, Buffer.from(arrayBuffer), {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });
      if (uploadError) return respondDbError('Upload failed.', uploadError);

      const publicUrl = bucket.getPublicUrl(path).data.publicUrl;
      previewUrl = publicUrl;
      outputUrl = publicUrl;
      if (!title) title = file.name;
    }
  } else {
    const payload = await req.json().catch(() => null);
    title = (payload?.title as string | undefined)?.trim() || '';
    previewUrl = payload?.preview_url ?? null;
    outputUrl = payload?.output_url ?? previewUrl ?? null;
  }

  if (!title) title = 'New render';

  const now = new Date().toISOString();
  const { count: existingCount } = await admin
    .from('project_images')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', resolved.projectId);

  const sortOrder = (existingCount ?? 0) + 1;

  const { data: image, error: imageError } = await admin
    .from('project_images')
    .insert({
      project_id: resolved.projectId,
      title,
      status: outputUrl ? 'delivered' : 'processing',
      preview_url: previewUrl,
      primary_output_url: outputUrl,
      sort_order: sortOrder,
      latest_version: 1,
      updated_at: now,
    })
    .select<ProjectImageRecord>()
    .single();

  if (imageError) return respondDbError('Failed to create image record.', imageError);

  const { data: version, error: versionError } = await admin
    .from('image_versions')
    .insert({
      image_id: image.id,
      version_number: 1,
      status: outputUrl ? 'delivered' : 'candidate',
      output_url: outputUrl ?? '',
      preview_url: previewUrl,
      created_by_name: user.email ?? 'You',
      created_at: now,
    })
    .select<ImageVersionRecord>()
    .single();

  if (versionError) return respondDbError('Failed to create initial version.', versionError);

  const { count: updatedCount } = await admin
    .from('project_images')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', resolved.projectId);

  await admin
    .from('projects')
    .update({
      images_count: updatedCount ?? sortOrder,
      latest_version: Math.max(image.latest_version ?? 1, 1),
      updated_at: now,
    })
    .eq('id', resolved.projectId);

  return NextResponse.json({ image, version }, { status: 201 });
}
