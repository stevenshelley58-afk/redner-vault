const FALLBACK = 'N/A';

export function formatDateTime(dateString?: string | null) {
  if (!dateString) return FALLBACK;
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return FALLBACK;

  return parsed.toLocaleString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(dateString?: string | null) {
  if (!dateString) return FALLBACK;
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) return FALLBACK;

  return parsed.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString?: string | null) {
  if (!dateString) return FALLBACK;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return FALLBACK;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDateTime(dateString);
}

