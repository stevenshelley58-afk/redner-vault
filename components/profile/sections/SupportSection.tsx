interface SupportSectionProps {
  userId: string;
  projectIdForDemo?: string;
}

export function SupportSection({ userId, projectIdForDemo }: SupportSectionProps) {
  const ref = `user_${userId}_project_${projectIdForDemo ?? 'overview'}`;
  const url = `https://m.me/YOUR_PAGE_ID?ref=${encodeURIComponent(ref)}`;

  return (
    <div className="space-y-3 text-sm text-text-subtle">
      <p>
        Need a hand with a brief or scene? Message us on Messenger.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-accent/90"
      >
        Message us on Messenger
      </a>
      <p className="text-[11px] text-text-subtle/80">
        The link includes your member reference so we can align chats with the right projects.
      </p>
    </div>
  );
}

