interface SecuritySectionProps {
  email: string;
}

export function SecuritySection({ email }: SecuritySectionProps) {
  return (
    <div className="space-y-3 text-sm text-text-subtle">
      <p>
        Your account is secured via email login. Password resets and magic links are handled by our authentication provider.
      </p>
      <div className="rounded-xl border border-border-ghost bg-surface/60 p-3 text-xs">
        <div className="mb-1 text-[11px] font-medium text-text-subtle">Primary login</div>
        <div className="font-medium text-text-ink">{email}</div>
      </div>
    </div>
  );
}

