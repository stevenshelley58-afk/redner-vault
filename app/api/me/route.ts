import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServiceRoleClient } from '@/lib/supabase/server';
import { getSessionUser, unauthorizedResponse } from '@/lib/server-auth';
import type {
  BillingAccountRecord,
  BillingTransactionRecord,
  BrandRecord,
  ProfileRecord,
  ProjectRecord,
} from '@/lib/backend-types';

export const dynamic = 'force-dynamic';

function respondDbError(message: string, error?: unknown, status = 500) {
  const details = typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : undefined;
  return NextResponse.json({ error: message, details }, { status });
}

function generateMemberId() {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `RV-${year}-${random}`;
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorizedResponse();

  const admin = createSupabaseServiceRoleClient();

  const { data: profileRow, error: profileError } = await admin
    .from('profiles')
    .select<ProfileRecord>('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError && profileError.code !== 'PGRST116') {
    return respondDbError('Failed to load profile.', profileError);
  }

  let profile = profileRow;
  if (!profile) {
    const insertPayload = {
      id: user.id,
      email: user.email ?? '',
      full_name: user.user_metadata?.full_name ?? user.email ?? 'New user',
      phone_number: null,
      company_name: null,
      country: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      role: 'customer',
      member_id: generateMemberId(),
    };
    const { data, error } = await admin.from('profiles').insert(insertPayload).select<ProfileRecord>().single();
    if (error) return respondDbError('Failed to create profile record.', error);
    profile = data;
  }

  const safeProfile = {
    ...profile,
    phone_number: profile.phone_number ?? '',
    company_name: profile.company_name ?? '',
    country: profile.country ?? '',
    timezone: profile.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    role: profile.role ?? 'customer',
    member_id: profile.member_id ?? generateMemberId(),
  };

  const { data: brandRow, error: brandError } = await admin
    .from('brands')
    .select<BrandRecord>('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (brandError && brandError.code !== 'PGRST116') return respondDbError('Failed to load brand.', brandError);
  const brand =
    brandRow
      ? { ...brandRow, primary_colors: brandRow.primary_colors ?? [] }
      : ({
          id: '',
          user_id: user.id,
          brand_name: '',
          brand_summary: '',
          tone_of_voice: '',
          visual_style: '',
          font_preferences: '',
          notes: '',
          primary_colors: [],
          logo_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } satisfies BrandRecord);

  const { data: billingRow, error: billingError } = await admin
    .from('billing_accounts')
    .select<BillingAccountRecord>('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (billingError && billingError.code !== 'PGRST116') return respondDbError('Failed to load billing.', billingError);

  let billing = billingRow;
  if (!billing) {
    const { data, error } = await admin
      .from('billing_accounts')
      .insert({ user_id: user.id, plan: null, credits_balance: 0 })
      .select<BillingAccountRecord>()
      .single();
    if (error) return respondDbError('Failed to create billing account.', error);
    billing = data;
  }

  const { data: transactions, error: txError } = await admin
    .from('billing_transactions')
    .select<BillingTransactionRecord>('*')
    .eq('billing_account_id', billing.id)
    .order('created_at', { ascending: false })
    .limit(20);
  if (txError) return respondDbError('Failed to load billing history.', txError);

  const { data: projects, error: projectsError } = await admin
    .from('projects')
    .select<ProjectRecord>('id,status,images_count,updated_at')
    .eq('user_id', user.id);
  if (projectsError) return respondDbError('Failed to load usage.', projectsError);

  const activeStatuses: ProjectRecord['status'][] = ['in_review', 'in_progress', 'awaiting_client'];
  const lastActivity = projects?.reduce<string | null>((latest, proj) => {
    if (!latest) return proj.updated_at;
    return new Date(proj.updated_at).getTime() > new Date(latest).getTime() ? proj.updated_at : latest;
  }, null);

  return NextResponse.json({
    profile: safeProfile,
    brand,
    billing: {
      plan: billing.plan,
      credits_balance: billing.credits_balance,
      recent_transactions: transactions ?? [],
    },
    usage: {
      total_projects: projects?.length ?? 0,
      active_projects: projects?.filter((p) => activeStatuses.includes(p.status)).length ?? 0,
      completed_images: projects?.reduce((sum, p) => sum + (p.images_count || 0), 0) ?? 0,
      last_activity: lastActivity,
    },
  });
}
