'use client';

import { MobileDashboard, AccountScreen } from '../app/MobileDashboard';
import { ProfilePage } from './ProfilePage';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';

interface ProfilePageWrapperProps {
  initialProfile: {
    id: string;
    email: string;
    full_name: string;
    phone_number: string;
    company_name: string;
    country: string;
    timezone: string;
    role: string;
    created_at: string;
    member_id: string;
  };
  initialBrand: any;
  initialBilling: any;
  initialUsage: any;
}

export function ProfilePageWrapper({
  initialProfile,
  initialBrand,
  initialBilling,
  initialUsage,
}: ProfilePageWrapperProps) {
  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch {
      // ignore
    }
  };

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden">
        <MobileDashboard>
          <AccountScreen userEmail={initialProfile.email} onLogout={handleLogout} />
        </MobileDashboard>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <ProfilePage
          initialProfile={initialProfile}
          initialBrand={initialBrand}
          initialBilling={initialBilling}
          initialUsage={initialUsage}
        />
      </div>
    </>
  );
}

