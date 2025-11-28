import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { ProfilePage } from '../../../components/profile/ProfilePage';

const demoProfile = {
  id: 'usr_demo_001',
  email: 'steven@bhm.com.au',
  full_name: 'Steven Shelley',
  phone_number: '+61 4XX XXX XXX',
  company_name: 'BHM Furniture & Homewares',
  country: 'Australia',
  timezone: 'Australia/Perth',
  role: 'customer',
  created_at: '2024-03-15T08:30:00Z',
  member_id: 'RV-2024-0847',
};

const demoBrand = {
  brand_name: 'BHM',
  brand_summary:
    'Perth-based furniture and homewares specializing in reclaimed teak and artisan-crafted items from Rajasthan, India.',
  tone_of_voice: 'Warm, authentic, craftsmanship-focused',
  visual_style: 'Natural textures, earth tones, minimal but substantial',
  logo_url: null,
  primary_colors: ['#2C1810', '#D4A574', '#8B7355', '#F5F0EB'],
  font_preferences: 'Clean serifs for headings, refined sans-serif for body',
  notes: 'Emphasis on the story behind each piece. Heritage and sustainability messaging.',
};

const demoBilling = {
  plan: null,
  credits_balance: 47,
  recent_transactions: [
    {
      id: 1,
      delta: -3,
      reason: 'job_created',
      created_at: '2024-11-25T10:00:00Z',
      notes: 'Product render - Teak Console',
    },
    {
      id: 2,
      delta: 50,
      reason: 'stripe_payment',
      created_at: '2024-11-20T14:30:00Z',
      notes: 'Credit pack purchase',
    },
    {
      id: 3,
      delta: -5,
      reason: 'job_created',
      created_at: '2024-11-18T09:15:00Z',
      notes: 'Lifestyle scene - Dining collection',
    },
  ],
};

const demoUsage = {
  total_projects: 12,
  active_projects: 3,
  completed_images: 47,
  last_activity: '2024-11-27T16:45:00Z',
};

export default async function ProfileRoutePage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getSession();

  // Redirect unauthenticated users to login (real routing will use Supabase session).
  if (!data?.session) {
    redirect('/login');
  }

  // TODO: Replace demo data with real `/api/me` once backend is wired.
  return (
    <ProfilePage
      initialProfile={demoProfile}
      initialBrand={demoBrand}
      initialBilling={demoBilling}
      initialUsage={demoUsage}
    />
  );
}
