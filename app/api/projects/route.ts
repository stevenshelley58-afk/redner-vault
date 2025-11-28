import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { getSessionUser, unauthorizedResponse } from '@/lib/server-auth';
import type { ProjectRecord } from '@/lib/backend-types';
import type { ProjectType } from '@/lib/project-types';

export const dynamic = 'force-dynamic';

function respondDbError(message: string, error?: unknown, status = 500) {
  const details = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : undefined;
  return NextResponse.json({ error: message, details }, { status });
}

function fallbackName() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return `New project ${date} ${time}`;
}

function billingPeriodLabel(dateInput?: string | null) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function sanitizeProjectType(value: string | null | undefined): ProjectType {
  if (value === 'image_render' || value === 'website_build' || value === 'other') return value;
  return 'image_render';
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const admin = createSupabaseServiceRoleClient();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const statusParam = searchParams.get('status');

  let query = admin.from('projects').select('*').eq('user_id', user.id);
  if (q) {
    query = query.or(`name.ilike.%${q}%,brief.ilike.%${q}%`);
  }
  if (statusParam) {
    query = query.in('status', statusParam.split(',').filter(Boolean));
  }
  query = query.order('updated_at', { ascending: false });

  const { data, error } = await query;
  if (error) return respondDbError('Failed to load projects. Run the Supabase schema migration and try again.', error);

  return NextResponse.json({ projects: data ?? [] });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const payload = await req.json().catch(() => null);
  const name = (payload?.name as string | undefined)?.trim() || fallbackName();
  const projectType = sanitizeProjectType(payload?.project_type);
  const brief = (payload?.brief as string | undefined)?.trim() || '';
  const dueDate = payload?.due_date ? String(payload.due_date) : null;

  const admin = createSupabaseServiceRoleClient();
  const now = new Date().toISOString();
  const { data, error } = await admin
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      project_type: projectType,
      status: 'draft',
      brief,
      due_date: dueDate,
      billing_period_label: billingPeriodLabel(dueDate),
      updated_at: now,
    })
    .select()
    .single();

  if (error) return respondDbError('Failed to create project. Ensure the Supabase tables exist.', error);

  return NextResponse.json({ project: data }, { status: 201 });
}
