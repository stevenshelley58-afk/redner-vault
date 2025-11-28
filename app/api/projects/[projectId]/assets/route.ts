import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { ensurePublicBucket } from '@/lib/storage';
import { getSessionUser, unauthorizedResponse } from '@/lib/server-auth';
import type { ProjectAssetRecord } from '@/lib/backend-types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function respondDbError(message: string, error?: unknown, status = 500) {
  const details = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : undefined;
  return NextResponse.json({ error: message, details }, { status });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  const label = (formData.get('label') as string | null) || file.name;
  const type = (formData.get('type') as string | null) || 'other';
  const admin = createSupabaseServiceRoleClient();

  const bucket = await ensurePublicBucket('project-assets');
  const safeName = file.name.replace(/\s+/g, '-');
  const path = `${user.id}/${projectId}/${Date.now()}-${safeName}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await bucket.upload(path, Buffer.from(arrayBuffer), {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });

  if (uploadError) return respondDbError('Upload failed.', uploadError);

  const publicUrl = bucket.getPublicUrl(path).data.publicUrl;
  const insertPayload = {
    project_id: projectId,
    type,
    label,
    file_url: publicUrl,
    file_thumbnail_url: publicUrl,
  };

  const { data, error } = await admin.from('project_assets').insert(insertPayload).select().single();
  if (error) return respondDbError('Failed to record asset in database.', error);

  await admin.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', projectId);

  return NextResponse.json({ asset: data }, { status: 201 });
}
