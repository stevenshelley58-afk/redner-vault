import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { getSessionUser, unauthorizedResponse } from '@/lib/server-auth';
import type { ProjectNoteRecord } from '@/lib/backend-types';

export const dynamic = 'force-dynamic';

function respondDbError(message: string, error?: unknown, status = 500) {
  const details = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : undefined;
  return NextResponse.json({ error: message, details }, { status });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const resolved = await params;
  const user = await getSessionUser(req);
  if (!user) return unauthorizedResponse();

  const payload = await req.json().catch(() => null);
  const body = (payload?.body as string | undefined)?.trim();
  if (!body) return NextResponse.json({ error: 'Note body is required' }, { status: 400 });

  const admin = createSupabaseServiceRoleClient();
  const insertPayload = {
    project_id: resolved.projectId,
    author_type: 'customer',
    author_name: payload?.author_name || user.email || 'You',
    body,
  };

  const { data, error } = await admin.from('project_notes').insert(insertPayload).select<ProjectNoteRecord>().single();
  if (error) return respondDbError('Failed to add note. Ensure the database is migrated.', error);

  await admin.from('projects').update({ updated_at: new Date().toISOString() }).eq('id', resolved.projectId);

  return NextResponse.json({ note: data }, { status: 201 });
}
