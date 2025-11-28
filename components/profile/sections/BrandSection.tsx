'use client';

import { useState } from 'react';
import { Input } from '../../ui/Input';
import { TextArea } from '../../ui/TextArea';
import { Button } from '../../ui/Button';

export interface BrandInfo {
  brand_name: string;
  brand_summary: string;
  tone_of_voice: string;
  visual_style: string;
  logo_url: string | null;
  primary_colors: string[];
  font_preferences: string;
  notes: string;
}

interface BrandSectionProps {
  value: BrandInfo;
  onChange: (value: BrandInfo) => void;
}

export function BrandSection({ value, onChange }: BrandSectionProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<BrandInfo>(value);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleFieldChange = (field: keyof BrandInfo, next: string) => {
    setDraft((prev) => ({ ...prev, [field]: next }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-text-ink">Brand specification</h2>
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

      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-subtle">Brand name</label>
            <Input
              value={editing ? draft.brand_name : value.brand_name}
              onChange={(e) => handleFieldChange('brand_name', e.target.value)}
              disabled={!editing}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-subtle">Tone of voice</label>
            <Input
              value={editing ? draft.tone_of_voice : value.tone_of_voice}
              onChange={(e) => handleFieldChange('tone_of_voice', e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Brand summary</label>
          <TextArea
            value={editing ? draft.brand_summary : value.brand_summary}
            onChange={(e) => handleFieldChange('brand_summary', e.target.value)}
            disabled={!editing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Visual style</label>
          <TextArea
            value={editing ? draft.visual_style : value.visual_style}
            onChange={(e) => handleFieldChange('visual_style', e.target.value)}
            disabled={!editing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Font preferences</label>
          <Input
            value={editing ? draft.font_preferences : value.font_preferences}
            onChange={(e) => handleFieldChange('font_preferences', e.target.value)}
            disabled={!editing}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-subtle">Notes</label>
          <TextArea
            value={editing ? draft.notes : value.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            disabled={!editing}
          />
        </div>
      </div>
    </div>
  );
}

