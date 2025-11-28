import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { getSessionUser, unauthorizedResponse } from '@/lib/server-auth';
import type { ImageCommentRecord } from '@/lib/backend-types';

export const dynamic = 'force-dynamic';

function respondDbError(message: string, error?: unknown, status = 500) {
  const details = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : undefined;
  return NextResponse.json({ error: message, details }, { status });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string; imageId: string }> }) {
  const resolved = await params;
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const payload = await req.json().catch(() => null);
  const body = (payload?.body as string | undefined)?.trim();
  const versionNumber = Number(payload?.version_number ?? 0);
  if (!body) return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
  if (!Number.isFinite(versionNumber) || versionNumber <= 0) {
    return NextResponse.json({ error: 'version_number is required' }, { status: 400 });
  }

  const admin = createSupabaseServiceRoleClient();
  const { data: projectCheck } = await admin.from('projects').select('id,user_id').eq('id', resolved.projectId).single();
  if (!projectCheck || projectCheck.user_id !== user.id) return unauthorizedResponse();

  const { data, error } = await admin
    .from('image_comments')
    .insert({
      image_id: resolved.imageId,
      version_number: versionNumber,
      author_type: 'customer',
      author_name: user.email ?? 'You',
      body,
    })
    .select()
    .single();

  if (error) return respondDbError('Failed to add comment.', error);

  return NextResponse.json({ comment: data }, { status: 201 });
}
