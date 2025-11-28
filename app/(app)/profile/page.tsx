import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { ProfilePage } from '../../../components/profile/ProfilePage';

export default async function ProfileRoutePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();

  if (!data?.session) {
    redirect('/login');
  }

  const cookieHeader = cookies().toString();
  const res = await fetch(`/api/me`, {
    cache: 'no-store',
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (!res.ok) {
    throw new Error('Failed to load profile data.');
  }

  const payload = await res.json();

  return (
    <ProfilePage
      initialProfile={payload.profile}
      initialBrand={payload.brand}
      initialBilling={payload.billing}
      initialUsage={payload.usage}
    />
  );
}
