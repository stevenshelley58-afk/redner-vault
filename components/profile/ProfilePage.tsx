'use client';

import { useEffect, useState } from 'react';
import { AccordionItem } from '../ui/Accordion';
import { Button } from '../ui/Button';
import { ProfileHeader } from './ProfileHeader';
import { PersonalInfoSection, type PersonalInfo } from './sections/PersonalInfoSection';
import { BrandSection, type BrandInfo } from './sections/BrandSection';
import { BillingCreditsSection, type BillingInfo } from './sections/BillingCreditsSection';
import { ProjectsUsageSection, type ProjectsUsage } from './sections/ProjectsUsageSection';
import { SecuritySection } from './sections/SecuritySection';
import { SupportSection } from './sections/SupportSection';
import { LegalSection } from './sections/LegalSection';

type AccordionId =
  | 'personal'
  | 'brand'
  | 'billing'
  | 'projects'
  | 'security'
  | 'support'
  | 'legal';

const ACCORDION_STORAGE_KEY = 'rv-profile-accordion-state';

interface ProfilePageProps {
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
  initialBrand: BrandInfo;
  initialBilling: BillingInfo;
  initialUsage: ProjectsUsage;
}

export function ProfilePage({
  initialProfile,
  initialBrand,
  initialBilling,
  initialUsage,
}: ProfilePageProps) {
  const [profile, setProfile] = useState<PersonalInfo>({
    full_name: initialProfile.full_name,
    email: initialProfile.email,
    phone_number: initialProfile.phone_number,
    company_name: initialProfile.company_name,
    country: initialProfile.country,
    timezone: initialProfile.timezone,
  });

  const [brand, setBrand] = useState<BrandInfo>(initialBrand);
  const [billing] = useState<BillingInfo>(initialBilling);
  const [usage] = useState<ProjectsUsage>(initialUsage);
  const [openAccordions, setOpenAccordions] = useState<AccordionId[]>([
    'personal',
    'brand',
    'billing',
  ]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(ACCORDION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setOpenAccordions(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(ACCORDION_STORAGE_KEY, JSON.stringify(openAccordions));
    } catch {
      // ignore
    }
  }, [openAccordions]);

  const toggleAccordion = (id: AccordionId) => {
    setOpenAccordions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleLogout = () => {
    // TODO: wire to Supabase sign-out
  };

  return (
    <div className="mx-auto max-w-3xl">
      <ProfileHeader
        fullName={profile.full_name}
        email={profile.email}
        company={profile.company_name}
        memberId={initialProfile.member_id}
        joinedAt={initialProfile.created_at}
      />

      <div className="space-y-3 md:space-y-4">
        <AccordionItem
          id="personal"
          title="Personal information"
          isOpen={openAccordions.includes('personal')}
          onToggle={(id) => toggleAccordion(id as AccordionId)}
        >
          <PersonalInfoSection value={profile} onChange={setProfile} />
        </AccordionItem>

        <AccordionItem
          id="brand"
          title="Brand details"
          isOpen={openAccordions.includes('brand')}
          onToggle={(id) => toggleAccordion(id as AccordionId)}
        >
          <BrandSection value={brand} onChange={setBrand} />
        </AccordionItem>

        <AccordionItem
          id="billing"
          title="Billing & credits"
          badge={`${billing.credits_balance} credits`}
          isOpen={openAccordions.includes('billing')}
          onToggle={(id) => toggleAccordion(id as AccordionId)}
        >
          <BillingCreditsSection value={billing} />
        </AccordionItem>

        <AccordionItem
          id="projects"
          title="Projects & usage"
          isOpen={openAccordions.includes('projects')}
          onToggle={(id) => toggleAccordion(id as AccordionId)}
        >
          <ProjectsUsageSection value={usage} />
        </AccordionItem>

        <AccordionItem
          id="security"
          title="Login & security"
          isOpen={openAccordions.includes('security')}
          onToggle={(id) => toggleAccordion(id as AccordionId)}
        >
          <SecuritySection email={profile.email} />
        </AccordionItem>

        <AccordionItem
          id="support"
          title="Support"
          isOpen={openAccordions.includes('support')}
          onToggle={(id) => toggleAccordion(id as AccordionId)}
        >
          <SupportSection userId={initialProfile.id} />
        </AccordionItem>

        <AccordionItem
          id="legal"
          title="Legal"
          isOpen={openAccordions.includes('legal')}
          onToggle={(id) => toggleAccordion(id as AccordionId)}
        >
          <LegalSection />
        </AccordionItem>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border-ghost pt-4 text-[11px] text-text-subtle md:flex-row">
        <Button variant="danger" className="px-4 py-1.5 text-xs" onClick={handleLogout}>
          Log out
        </Button>
        <div className="flex flex-col items-center gap-1 text-[11px] text-text-subtle/80 md:items-end">
          <span>Render Vault · Profile</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

