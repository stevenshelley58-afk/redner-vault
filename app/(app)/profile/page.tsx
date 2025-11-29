import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSessionUser } from '../../../lib/server-auth';
import { ProfilePageWrapper } from '../../../components/profile/ProfilePageWrapper';

export default async function ProfileRoutePage() {
  const user = await getSessionUser();

  if (!user) {
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
    <ProfilePageWrapper
      initialProfile={payload.profile}
      initialBrand={payload.brand}
      initialBilling={payload.billing}
      initialUsage={payload.usage}
    />
  );
}
