import React, { useState, useEffect, useCallback } from 'react';

// ============================================================================
// DESIGN SYSTEM & CONSTANTS
// ============================================================================

const ACCORDION_STORAGE_KEY = 'rv-profile-accordion-state';

const initialProfileData = {
  id: 'usr_demo_001',
  email: 'steven@bhm.com.au',
  full_name: 'Steven Shelley',
  avatar_url: null,
  phone_number: '+61 4XX XXX XXX',
  company_name: 'BHM Furniture & Homewares',
  country: 'Australia',
  timezone: 'Australia/Perth',
  role: 'customer',
  created_at: '2024-03-15T08:30:00Z',
  member_id: 'RV-2024-0847',
};

const initialBrandData = {
  brand_name: 'BHM',
  brand_summary: 'Perth-based furniture and homewares specializing in reclaimed teak and artisan-crafted items from Rajasthan, India.',
  tone_of_voice: 'Warm, authentic, craftsmanship-focused',
  visual_style: 'Natural textures, earth tones, minimal but substantial',
  logo_url: null,
  primary_colors: ['#2C1810', '#D4A574', '#8B7355', '#F5F0EB'],
  font_preferences: 'Clean serifs for headings, refined sans-serif for body',
  notes: 'Emphasis on the story behind each piece. Heritage and sustainability messaging.',
};

const initialBillingData = {
  plan: null,
  credits_balance: 47,
  recent_transactions: [
    { id: 1, delta: -3, reason: 'job_created', created_at: '2024-11-25T10:00:00Z', notes: 'Product render - Teak Console' },
    { id: 2, delta: 50, reason: 'stripe_payment', created_at: '2024-11-20T14:30:00Z', notes: 'Credit pack purchase' },
    { id: 3, delta: -5, reason: 'job_created', created_at: '2024-11-18T09:15:00Z', notes: 'Lifestyle scene - Dining collection' },
  ],
};

const initialProjectsUsage = {
  total_projects: 12,
  active_projects: 3,
  completed_images: 47,
  last_activity: '2024-11-27T16:45:00Z',
};

// ============================================================================
// ICONS (Inline SVG for self-contained component)
// ============================================================================

const Icons = {
  ChevronDown: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  User: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Palette: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  CreditCard: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  FolderOpen: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Shield: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  ),
  MessageCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  FileText: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  ),
  LogOut: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  ),
  Check: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Edit: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  Upload: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  ),
  ExternalLink: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  ),
  Coins: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  ),
  Clock: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Camera: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

const getTransactionLabel = (reason) => {
  const labels = {
    manual_adjustment: 'Manual adjustment',
    job_created: 'Project created',
    stripe_payment: 'Credit purchase',
    refund: 'Refund',
    promo: 'Promotional credit',
  };
  return labels[reason] || reason;
};

// ============================================================================
// REUSABLE UI COMPONENTS
// ============================================================================

const Input = ({ label, value, onChange, type = 'text', placeholder, disabled, error }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`input-field ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}
    />
    {error && <span className="input-error-text">{error}</span>}
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, disabled, rows = 3 }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`input-field textarea ${disabled ? 'input-disabled' : ''}`}
    />
  </div>
);

const Select = ({ label, value, onChange, options, disabled }) => (
  <div className="input-group">
    {label && <label className="input-label">{label}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`input-field select ${disabled ? 'input-disabled' : ''}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled, loading, icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`btn btn-${variant} btn-${size} ${loading ? 'btn-loading' : ''}`}
  >
    {loading ? (
      <span className="btn-spinner" />
    ) : Icon ? (
      <Icon className="btn-icon" />
    ) : null}
    {children}
  </button>
);

const Badge = ({ children, variant = 'default' }) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

const ColorSwatch = ({ color, size = 'md' }) => (
  <span 
    className={`color-swatch color-swatch-${size}`} 
    style={{ backgroundColor: color }}
    title={color}
  />
);

// ============================================================================
// ACCORDION COMPONENT
// ============================================================================

const Accordion = ({ id, title, icon: Icon, children, isOpen, onToggle, badge }) => {
  return (
    <div className={`accordion ${isOpen ? 'accordion-open' : ''}`}>
      <button className="accordion-header" onClick={() => onToggle(id)}>
        <div className="accordion-header-left">
          <div className="accordion-icon-wrapper">
            <Icon className="accordion-icon" />
          </div>
          <span className="accordion-title">{title}</span>
          {badge && <Badge variant="subtle">{badge}</Badge>}
        </div>
        <Icons.ChevronDown className={`accordion-chevron ${isOpen ? 'accordion-chevron-open' : ''}`} />
      </button>
      <div className={`accordion-content ${isOpen ? 'accordion-content-open' : ''}`}>
        <div className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

const PersonalInfoSection = ({ profile, setProfile, isEditing, setIsEditing }) => {
  const [localData, setLocalData] = useState(profile);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    setProfile(localData);
    setIsEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setLocalData(profile);
    setIsEditing(false);
  };

  const timezones = [
    { value: 'Australia/Perth', label: 'Perth (AWST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
    { value: 'Australia/Melbourne', label: 'Melbourne (AEST)' },
    { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
    { value: 'Australia/Adelaide', label: 'Adelaide (ACST)' },
  ];

  const countries = [
    { value: 'Australia', label: 'Australia' },
    { value: 'New Zealand', label: 'New Zealand' },
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Singapore', label: 'Singapore' },
  ];

  return (
    <div className="section-content">
      {isEditing ? (
        <>
          <div className="form-grid">
            <Input
              label="Full name"
              value={localData.full_name}
              onChange={(v) => setLocalData({ ...localData, full_name: v })}
            />
            <Input
              label="Email"
              value={localData.email}
              disabled
              onChange={() => {}}
            />
            <Input
              label="Phone number"
              value={localData.phone_number}
              onChange={(v) => setLocalData({ ...localData, phone_number: v })}
              placeholder="+61 XXX XXX XXX"
            />
            <Input
              label="Company name"
              value={localData.company_name}
              onChange={(v) => setLocalData({ ...localData, company_name: v })}
            />
            <Select
              label="Country"
              value={localData.country}
              onChange={(v) => setLocalData({ ...localData, country: v })}
              options={countries}
            />
            <Select
              label="Timezone"
              value={localData.timezone}
              onChange={(v) => setLocalData({ ...localData, timezone: v })}
              options={timezones}
            />
          </div>
          <div className="section-actions">
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save changes</Button>
          </div>
        </>
      ) : (
        <>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Full name</span>
              <span className="info-value">{profile.full_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{profile.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phone</span>
              <span className="info-value">{profile.phone_number || '—'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Company</span>
              <span className="info-value">{profile.company_name || '—'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Country</span>
              <span className="info-value">{profile.country}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Timezone</span>
              <span className="info-value">{profile.timezone.replace('_', ' ').replace('Australia/', '')}</span>
            </div>
          </div>
          <div className="section-actions">
            <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Icons.Edit}>
              Edit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const BrandSection = ({ brand, setBrand, isEditing, setIsEditing }) => {
  const [localData, setLocalData] = useState(brand);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setBrand(localData);
    setIsEditing(false);
    setSaving(false);
  };

  const handleCancel = () => {
    setLocalData(brand);
    setIsEditing(false);
  };

  return (
    <div className="section-content">
      {isEditing ? (
        <>
          <div className="form-stack">
            <Input
              label="Brand name"
              value={localData.brand_name}
              onChange={(v) => setLocalData({ ...localData, brand_name: v })}
            />
            <TextArea
              label="Brand summary"
              value={localData.brand_summary}
              onChange={(v) => setLocalData({ ...localData, brand_summary: v })}
              rows={3}
            />
            <Input
              label="Tone of voice"
              value={localData.tone_of_voice}
              onChange={(v) => setLocalData({ ...localData, tone_of_voice: v })}
              placeholder="e.g., Professional, friendly, technical"
            />
            <Input
              label="Visual style"
              value={localData.visual_style}
              onChange={(v) => setLocalData({ ...localData, visual_style: v })}
              placeholder="e.g., Minimal, bold, organic"
            />
            <Input
              label="Font preferences"
              value={localData.font_preferences}
              onChange={(v) => setLocalData({ ...localData, font_preferences: v })}
            />
            <TextArea
              label="Additional notes"
              value={localData.notes}
              onChange={(v) => setLocalData({ ...localData, notes: v })}
              rows={2}
            />
          </div>
          <div className="section-actions">
            <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save changes</Button>
          </div>
        </>
      ) : (
        <>
          <div className="brand-display">
            <div className="brand-header-row">
              <div className="brand-logo-placeholder">
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.brand_name} />
                ) : (
                  <Icons.Upload className="brand-logo-icon" />
                )}
              </div>
              <div className="brand-name-block">
                <h4 className="brand-name">{brand.brand_name}</h4>
                <p className="brand-summary">{brand.brand_summary}</p>
              </div>
            </div>

            <div className="brand-colors">
              <span className="info-label">Brand colors</span>
              <div className="color-swatches">
                {brand.primary_colors.map((color, i) => (
                  <ColorSwatch key={i} color={color} />
                ))}
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Tone of voice</span>
                <span className="info-value">{brand.tone_of_voice}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Visual style</span>
                <span className="info-value">{brand.visual_style}</span>
              </div>
              <div className="info-item info-item-full">
                <span className="info-label">Font preferences</span>
                <span className="info-value">{brand.font_preferences}</span>
              </div>
              {brand.notes && (
                <div className="info-item info-item-full">
                  <span className="info-label">Notes</span>
                  <span className="info-value info-value-muted">{brand.notes}</span>
                </div>
              )}
            </div>
          </div>
          <div className="section-actions">
            <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Icons.Edit}>
              Edit brand
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

const BillingCreditsSection = ({ billing }) => {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);
    // Simulate API call to create portal session
    await new Promise(r => setTimeout(r, 600));
    // In production: window.location.href = response.url
    alert('Would redirect to Stripe Customer Portal');
    setLoading(false);
  };

  return (
    <div className="section-content">
      <div className="billing-cards">
        <div className="billing-card billing-card-primary">
          <div className="billing-card-header">
            <Icons.Coins className="billing-card-icon" />
            <span className="billing-card-title">Credits balance</span>
          </div>
          <div className="billing-card-value">
            <span className="credits-amount">{billing.credits_balance}</span>
            <span className="credits-label">credits</span>
          </div>
        </div>

        <div className="billing-card">
          <div className="billing-card-header">
            <Icons.CreditCard className="billing-card-icon" />
            <span className="billing-card-title">Current plan</span>
          </div>
          <div className="billing-card-value">
            <span className="plan-name">{billing.plan || 'Pay as you go'}</span>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <h4 className="transactions-title">Recent activity</h4>
        <div className="transactions-list">
          {billing.recent_transactions.map((tx) => (
            <div key={tx.id} className="transaction-item">
              <div className="transaction-left">
                <span className="transaction-reason">{getTransactionLabel(tx.reason)}</span>
                <span className="transaction-notes">{tx.notes}</span>
              </div>
              <div className="transaction-right">
                <span className={`transaction-delta ${tx.delta > 0 ? 'positive' : 'negative'}`}>
                  {tx.delta > 0 ? '+' : ''}{tx.delta}
                </span>
                <span className="transaction-date">{formatRelativeTime(tx.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-actions">
        <Button variant="secondary" onClick={handleManageBilling} loading={loading} icon={Icons.ExternalLink}>
          Manage billing
        </Button>
      </div>
    </div>
  );
};

const ProjectsUsageSection = ({ usage }) => {
  return (
    <div className="section-content">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{usage.total_projects}</span>
          <span className="stat-label">Total projects</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{usage.active_projects}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{usage.completed_images}</span>
          <span className="stat-label">Images delivered</span>
        </div>
      </div>

      <div className="usage-meta">
        <Icons.Clock className="usage-meta-icon" />
        <span>Last activity: {formatRelativeTime(usage.last_activity)}</span>
      </div>

      <div className="section-actions">
        <Button variant="secondary" onClick={() => window.location.href = '/projects'}>
          View all projects
        </Button>
      </div>
    </div>
  );
};

const SecuritySection = ({ profile }) => {
  return (
    <div className="section-content">
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Email</span>
          <span className="info-value">{profile.email}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Member since</span>
          <span className="info-value">{formatDate(profile.created_at)}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Password</span>
          <span className="info-value">••••••••••••</span>
        </div>
      </div>

      <div className="section-actions">
        <Button variant="secondary" onClick={() => alert('Would redirect to password reset')}>
          Change password
        </Button>
      </div>
    </div>
  );
};

const SupportSection = ({ profile }) => {
  const messengerPageId = 'YOUR_PAGE_ID'; // Replace with actual page ID
  const messengerLink = `https://m.me/${messengerPageId}?ref=user_${profile.id}`;

  return (
    <div className="section-content">
      <div className="support-options">
        <a 
          href={messengerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="support-card support-card-messenger"
        >
          <div className="support-card-icon-wrapper">
            <Icons.MessageCircle className="support-card-icon" />
          </div>
          <div className="support-card-content">
            <span className="support-card-title">Message us on Messenger</span>
            <span className="support-card-desc">Get help quickly via Facebook Messenger</span>
          </div>
          <Icons.ExternalLink className="support-card-arrow" />
        </a>

        <a 
          href="mailto:support@rendervault.com"
          className="support-card"
        >
          <div className="support-card-icon-wrapper">
            <Icons.FileText className="support-card-icon" />
          </div>
          <div className="support-card-content">
            <span className="support-card-title">Email support</span>
            <span className="support-card-desc">support@rendervault.com</span>
          </div>
          <Icons.ExternalLink className="support-card-arrow" />
        </a>
      </div>
    </div>
  );
};

const LegalSection = () => {
  return (
    <div className="section-content">
      <div className="legal-links">
        <a href="/terms" className="legal-link">
          <Icons.FileText className="legal-link-icon" />
          <span>Terms of Service</span>
        </a>
        <a href="/privacy" className="legal-link">
          <Icons.Shield className="legal-link-icon" />
          <span>Privacy Policy</span>
        </a>
      </div>
    </div>
  );
};

// ============================================================================
// PROFILE HEADER COMPONENT
// ============================================================================

const ProfileHeader = ({ profile }) => {
  const initials = profile.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-header">
      <div className="profile-header-main">
        <div className="avatar-wrapper">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="avatar-image" />
          ) : (
            <div className="avatar-initials">{initials}</div>
          )}
          <button className="avatar-edit-btn" title="Change photo">
            <Icons.Camera className="avatar-edit-icon" />
          </button>
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">{profile.full_name}</h1>
          <p className="profile-email">{profile.email}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PROFILE COMPONENT
// ============================================================================

export default function UserProfile() {
  const [profile, setProfile] = useState(initialProfileData);
  const [brand, setBrand] = useState(initialBrandData);
  const [billing] = useState(initialBillingData);
  const [projectsUsage] = useState(initialProjectsUsage);
  
  const [openAccordions, setOpenAccordions] = useState(() => {
    // Try to restore from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ACCORDION_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return ['personal'];
        }
      }
    }
    return ['personal'];
  });

  const [editingSection, setEditingSection] = useState(null);

  // Persist accordion state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ACCORDION_STORAGE_KEY, JSON.stringify(openAccordions));
    }
  }, [openAccordions]);

  const toggleAccordion = useCallback((id) => {
    setOpenAccordions(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // In production: call supabase.auth.signOut()
      alert('Would log out');
    }
  };

  return (
    <div className="profile-container">
      <style>{`
        /* ============================================================
           CSS RESET & VARIABLES
           ============================================================ */
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --color-bg: #0A0A0B;
          --color-bg-elevated: #111113;
          --color-bg-subtle: #18181B;
          --color-border: #27272A;
          --color-border-subtle: #1F1F23;
          
          --color-text: #FAFAFA;
          --color-text-secondary: #A1A1AA;
          --color-text-muted: #71717A;
          
          --color-accent: #D4A574;
          --color-accent-hover: #E5B885;
          --color-accent-subtle: rgba(212, 165, 116, 0.1);
          
          --color-positive: #4ADE80;
          --color-negative: #F87171;
          
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 14px;
          --radius-full: 9999px;
          
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
          --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
          
          --transition-fast: 150ms ease;
          --transition-base: 200ms ease;
          --transition-slow: 300ms ease;
        }

        /* ============================================================
           PROFILE CONTAINER
           ============================================================ */

        .profile-container {
          min-height: 100vh;
          background: var(--color-bg);
          color: var(--color-text);
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .profile-wrapper {
          max-width: 640px;
          margin: 0 auto;
          padding: 24px 16px 80px;
        }

        @media (min-width: 640px) {
          .profile-wrapper {
            padding: 40px 24px 100px;
          }
        }

        /* ============================================================
           PROFILE HEADER
           ============================================================ */

        .profile-header {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .profile-header-main {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .avatar-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .avatar-initials,
        .avatar-image {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--color-accent) 0%, #B8956A 100%);
          color: var(--color-bg);
        }

        .avatar-image {
          object-fit: cover;
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--color-bg-elevated);
          border: 2px solid var(--color-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .avatar-edit-btn:hover {
          background: var(--color-bg-subtle);
          transform: scale(1.05);
        }

        .avatar-edit-icon {
          width: 14px;
          height: 14px;
          color: var(--color-text-secondary);
        }

        .profile-header-info {
          flex: 1;
          min-width: 0;
        }

        .profile-name {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
          color: var(--color-text);
        }

        .profile-email {
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        /* ============================================================
           ACCORDION
           ============================================================ */

        .accordions-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .accordion {
          background: var(--color-bg-elevated);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all var(--transition-base);
        }

        .accordion:first-child {
          border-top-left-radius: var(--radius-lg);
          border-top-right-radius: var(--radius-lg);
        }

        .accordion:last-child {
          border-bottom-left-radius: var(--radius-lg);
          border-bottom-right-radius: var(--radius-lg);
        }

        .accordion-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          transition: background var(--transition-fast);
        }

        .accordion-header:hover {
          background: var(--color-bg-subtle);
        }

        .accordion-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .accordion-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: var(--color-accent-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .accordion-icon {
          width: 18px;
          height: 18px;
          color: var(--color-accent);
        }

        .accordion-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text);
        }

        .accordion-chevron {
          width: 18px;
          height: 18px;
          color: var(--color-text-muted);
          transition: transform var(--transition-base);
        }

        .accordion-chevron-open {
          transform: rotate(180deg);
        }

        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height var(--transition-slow);
        }

        .accordion-content-open {
          max-height: 2000px;
        }

        .accordion-content-inner {
          padding: 0 20px 20px;
        }

        /* ============================================================
           SECTION CONTENT
           ============================================================ */

        .section-content {
          padding-top: 4px;
        }

        .section-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--color-border-subtle);
        }

        /* ============================================================
           INFO DISPLAY
           ============================================================ */

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 480px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-item-full {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
        }

        .info-value {
          font-size: 14px;
          color: var(--color-text);
        }

        .info-value-muted {
          color: var(--color-text-secondary);
        }

        /* ============================================================
           FORM ELEMENTS
           ============================================================ */

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 480px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .input-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .input-field {
          width: 100%;
          padding: 10px 14px;
          font-family: inherit;
          font-size: 14px;
          color: var(--color-text);
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .input-field:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px var(--color-accent-subtle);
        }

        .input-field::placeholder {
          color: var(--color-text-muted);
        }

        .input-field.input-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-field.textarea {
          resize: vertical;
          min-height: 80px;
        }

        .input-field.select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 40px;
        }

        /* ============================================================
           BUTTONS
           ============================================================ */

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 18px;
          border-radius: var(--radius-sm);
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          width: 16px;
          height: 16px;
        }

        .btn-primary {
          background: var(--color-accent);
          color: var(--color-bg);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--color-accent-hover);
        }

        .btn-secondary {
          background: var(--color-bg-subtle);
          color: var(--color-text);
          border: 1px solid var(--color-border);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--color-border);
        }

        .btn-ghost {
          background: transparent;
          color: var(--color-text-secondary);
        }

        .btn-ghost:hover:not(:disabled) {
          background: var(--color-bg-subtle);
          color: var(--color-text);
        }

        .btn-danger {
          background: transparent;
          color: var(--color-negative);
          border: 1px solid currentColor;
        }

        .btn-danger:hover:not(:disabled) {
          background: rgba(248, 113, 113, 0.1);
        }

        .btn-loading {
          position: relative;
          color: transparent !important;
        }

        .btn-spinner {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .btn-primary .btn-spinner {
          border-color: var(--color-bg);
          border-top-color: transparent;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ============================================================
           BADGE
           ============================================================ */

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-radius: var(--radius-full);
        }

        .badge-default {
          background: var(--color-bg-subtle);
          color: var(--color-text-secondary);
        }

        .badge-subtle {
          background: var(--color-accent-subtle);
          color: var(--color-accent);
        }

        /* ============================================================
           BRAND SECTION
           ============================================================ */

        .brand-display {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .brand-header-row {
          display: flex;
          gap: 16px;
        }

        .brand-logo-placeholder {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          border-radius: var(--radius-md);
          background: var(--color-bg);
          border: 1px dashed var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-logo-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: var(--radius-md);
        }

        .brand-logo-icon {
          width: 24px;
          height: 24px;
          color: var(--color-text-muted);
        }

        .brand-name-block {
          flex: 1;
          min-width: 0;
        }

        .brand-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .brand-summary {
          font-size: 13px;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .brand-colors {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .color-swatches {
          display: flex;
          gap: 8px;
        }

        .color-swatch {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
        }

        .color-swatch-sm {
          width: 24px;
          height: 24px;
        }

        /* ============================================================
           BILLING SECTION
           ============================================================ */

        .billing-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        @media (max-width: 480px) {
          .billing-cards {
            grid-template-columns: 1fr;
          }
        }

        .billing-card {
          padding: 16px;
          background: var(--color-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
        }

        .billing-card-primary {
          background: linear-gradient(135deg, var(--color-accent-subtle) 0%, transparent 100%);
          border-color: rgba(212, 165, 116, 0.2);
        }

        .billing-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .billing-card-icon {
          width: 16px;
          height: 16px;
          color: var(--color-text-muted);
        }

        .billing-card-primary .billing-card-icon {
          color: var(--color-accent);
        }

        .billing-card-title {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
        }

        .billing-card-value {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .credits-amount {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 600;
          color: var(--color-accent);
          line-height: 1;
        }

        .credits-label {
          font-size: 14px;
          color: var(--color-text-secondary);
        }

        .plan-name {
          font-size: 16px;
          font-weight: 500;
          color: var(--color-text);
        }

        .transactions-section {
          margin-bottom: 4px;
        }

        .transactions-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary);
          margin-bottom: 12px;
        }

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: var(--color-border-subtle);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .transaction-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          background: var(--color-bg);
        }

        .transaction-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .transaction-reason {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text);
        }

        .transaction-notes {
          font-size: 12px;
          color: var(--color-text-muted);
        }

        .transaction-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .transaction-delta {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: 600;
        }

        .transaction-delta.positive {
          color: var(--color-positive);
        }

        .transaction-delta.negative {
          color: var(--color-negative);
        }

        .transaction-date {
          font-size: 11px;
          color: var(--color-text-muted);
        }

        /* ============================================================
           STATS GRID
           ============================================================ */

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stat-card {
          padding: 16px;
          background: var(--color-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          text-align: center;
        }

        .stat-value {
          display: block;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
        }

        .usage-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--color-text-muted);
        }

        .usage-meta-icon {
          width: 14px;
          height: 14px;
        }

        /* ============================================================
           SUPPORT SECTION
           ============================================================ */

        .support-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .support-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: var(--color-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-subtle);
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .support-card:hover {
          background: var(--color-bg-subtle);
          border-color: var(--color-border);
        }

        .support-card-messenger {
          background: linear-gradient(135deg, rgba(0, 132, 255, 0.1) 0%, transparent 100%);
          border-color: rgba(0, 132, 255, 0.2);
        }

        .support-card-messenger:hover {
          border-color: rgba(0, 132, 255, 0.4);
        }

        .support-card-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: var(--color-bg-elevated);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .support-card-messenger .support-card-icon-wrapper {
          background: rgba(0, 132, 255, 0.15);
        }

        .support-card-icon {
          width: 20px;
          height: 20px;
          color: var(--color-text-secondary);
        }

        .support-card-messenger .support-card-icon {
          color: #0084FF;
        }

        .support-card-content {
          flex: 1;
          min-width: 0;
        }

        .support-card-title {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text);
        }

        .support-card-desc {
          display: block;
          font-size: 12px;
          color: var(--color-text-muted);
        }

        .support-card-arrow {
          width: 16px;
          height: 16px;
          color: var(--color-text-muted);
        }

        /* ============================================================
           LEGAL SECTION
           ============================================================ */

        .legal-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .legal-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          color: var(--color-text-secondary);
          text-decoration: none;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .legal-link:hover {
          background: var(--color-bg);
          color: var(--color-text);
        }

        .legal-link-icon {
          width: 16px;
          height: 16px;
        }

        /* ============================================================
           LOGOUT SECTION
           ============================================================ */

        .logout-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border-subtle);
        }

        /* ============================================================
           FOOTER
           ============================================================ */

        .profile-footer {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid var(--color-border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .member-info {
          font-size: 12px;
          color: var(--color-text-muted);
        }

        .member-info span {
          display: block;
        }

        .version-info {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-text-muted);
        }

        /* ============================================================
           ANIMATIONS
           ============================================================ */

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-wrapper {
          animation: fadeIn 0.4s ease;
        }

        .accordion {
          animation: fadeIn 0.3s ease;
          animation-fill-mode: both;
        }

        .accordion:nth-child(1) { animation-delay: 0.05s; }
        .accordion:nth-child(2) { animation-delay: 0.1s; }
        .accordion:nth-child(3) { animation-delay: 0.15s; }
        .accordion:nth-child(4) { animation-delay: 0.2s; }
        .accordion:nth-child(5) { animation-delay: 0.25s; }
        .accordion:nth-child(6) { animation-delay: 0.3s; }
        .accordion:nth-child(7) { animation-delay: 0.35s; }
      `}</style>

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:wght@500;600;700&display=swap" 
        rel="stylesheet" 
      />

      <div className="profile-wrapper">
        <ProfileHeader profile={profile} />

        <div className="accordions-container">
          <Accordion
            id="personal"
            title="Personal information"
            icon={Icons.User}
            isOpen={openAccordions.includes('personal')}
            onToggle={toggleAccordion}
          >
            <PersonalInfoSection
              profile={profile}
              setProfile={setProfile}
              isEditing={editingSection === 'personal'}
              setIsEditing={(v) => setEditingSection(v ? 'personal' : null)}
            />
          </Accordion>

          <Accordion
            id="brand"
            title="Brand details"
            icon={Icons.Palette}
            isOpen={openAccordions.includes('brand')}
            onToggle={toggleAccordion}
          >
            <BrandSection
              brand={brand}
              setBrand={setBrand}
              isEditing={editingSection === 'brand'}
              setIsEditing={(v) => setEditingSection(v ? 'brand' : null)}
            />
          </Accordion>

          <Accordion
            id="billing"
            title="Billing & credits"
            icon={Icons.CreditCard}
            isOpen={openAccordions.includes('billing')}
            onToggle={toggleAccordion}
            badge={`${billing.credits_balance} credits`}
          >
            <BillingCreditsSection billing={billing} />
          </Accordion>

          <Accordion
            id="projects"
            title="Projects & usage"
            icon={Icons.FolderOpen}
            isOpen={openAccordions.includes('projects')}
            onToggle={toggleAccordion}
          >
            <ProjectsUsageSection usage={projectsUsage} />
          </Accordion>

          <Accordion
            id="security"
            title="Login & security"
            icon={Icons.Shield}
            isOpen={openAccordions.includes('security')}
            onToggle={toggleAccordion}
          >
            <SecuritySection profile={profile} />
          </Accordion>

          <Accordion
            id="support"
            title="Support"
            icon={Icons.MessageCircle}
            isOpen={openAccordions.includes('support')}
            onToggle={toggleAccordion}
          >
            <SupportSection profile={profile} />
          </Accordion>

          <Accordion
            id="legal"
            title="Legal"
            icon={Icons.FileText}
            isOpen={openAccordions.includes('legal')}
            onToggle={toggleAccordion}
          >
            <LegalSection />
          </Accordion>
        </div>

        <div className="logout-section">
          <Button variant="danger" onClick={handleLogout} icon={Icons.LogOut}>
            Log out
          </Button>
        </div>

        <div className="profile-footer">
          <div className="member-info">
            <span>Member ID: {profile.member_id}</span>
            <span>Member since {formatDate(profile.created_at)}</span>
          </div>
          <div className="version-info">
            v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
