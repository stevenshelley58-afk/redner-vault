import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { getSessionUser, unauthorizedResponse } from '@/lib/server-auth';
import type {
  ProjectRecord,
  ProjectAssetRecord,
  ProjectNoteRecord,
  ProjectImageRecord,
} from '@/lib/backend-types';

export const dynamic = 'force-dynamic';

function respondDbError(message: string, error?: unknown, status = 500) {
  const details = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : undefined;
  return NextResponse.json({ error: message, details }, { status });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const resolved = await params;
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const admin = createSupabaseServiceRoleClient();
  const projectId = resolved.projectId;

  const { data: project, error: projectError } = await admin
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (projectError) {
    const status = projectError.code === 'PGRST116' ? 404 : 500;
    return respondDbError('Project not found or database not initialized.', projectError, status);
  }

  const [assetsRes, notesRes, imagesRes] = await Promise.all([
    admin.from('project_assets').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    admin.from('project_notes').select('*').eq('project_id', projectId).order('created_at', { ascending: false }),
    admin.from('project_images').select('*').eq('project_id', projectId).order('sort_order', { ascending: true }),
  ]);

  if (assetsRes.error) return respondDbError('Failed to load assets.', assetsRes.error);
  if (notesRes.error) return respondDbError('Failed to load notes.', notesRes.error);
  if (imagesRes.error) return respondDbError('Failed to load images.', imagesRes.error);

  return NextResponse.json({
    project,
    assets: assetsRes.data ?? [],
    notes: notesRes.data ?? [],
    images: imagesRes.data ?? [],
  });
}
