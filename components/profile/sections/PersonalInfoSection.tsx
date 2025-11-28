'use client';

import { useState } from 'react';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  country: string;
  timezone: string;
}

interface PersonalInfoSectionProps {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
}

export function PersonalInfoSection({ value, onChange }: PersonalInfoSectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PersonalInfo>(value);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleFieldChange = (field: keyof PersonalInfo, next: string) => {
    setDraft((prev) => ({ ...prev, [field]: next }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-text-ink">Contact details</h2>
        {!editing ? (
          <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => setEditing(true)}>
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="px-2 py-1 text-xs"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="px-3 py-1 text-xs"
              type="button"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Full name</label>
          <Input
            value={editing ? draft.full_name : value.full_name}
            onChange={(e) => handleFieldChange('full_name', e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Email</label>
          <Input value={value.email} disabled />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Phone number</label>
          <Input
            value={editing ? draft.phone_number : value.phone_number}
            onChange={(e) => handleFieldChange('phone_number', e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Company</label>
          <Input
            value={editing ? draft.company_name : value.company_name}
            onChange={(e) => handleFieldChange('company_name', e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Country</label>
          <Input
            value={editing ? draft.country : value.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            disabled={!editing}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Timezone</label>
          <Input
            value={editing ? draft.timezone : value.timezone}
            onChange={(e) => handleFieldChange('timezone', e.target.value)}
            disabled={!editing}
          />
        </div>
      </div>
    </div>
  );
}

