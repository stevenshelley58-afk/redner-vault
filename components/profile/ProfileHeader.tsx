import { Card } from '../ui/Card';

export interface ProfileHeaderProps {
  fullName: string;
  email: string;
  company?: string | null;
  memberId?: string | null;
  joinedAt?: string | null;
}

export function ProfileHeader({
  fullName,
  email,
  company,
  memberId,
  joinedAt,
}: ProfileHeaderProps) {
  return (
    <Card className="mb-5 md:mb-6">
      <div className="flex items-start gap-4 md:gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-base font-semibold text-text-ink shadow-sm md:h-14 md:w-14">
          {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight md:text-xl">
              {fullName || 'Your profile'}
            </h1>
            {company && (
              <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-text-subtle">
                {company}
              </span>
            )}
          </div>
          <p className="text-xs text-text-subtle md:text-sm">{email}</p>
          {(memberId || joinedAt) && (
            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-text-subtle">
              {memberId && <span>Member ID: {memberId}</span>}
              {joinedAt && (
                <span>Member since {new Date(joinedAt).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

