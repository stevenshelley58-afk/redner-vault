export interface ProjectsUsage {
  total_projects: number;
  active_projects: number;
  completed_images: number;
  last_activity: string | null;
}

interface ProjectsUsageSectionProps {
  value: ProjectsUsage;
}

export function ProjectsUsageSection({ value }: ProjectsUsageSectionProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <StatBlock label="Total projects" value={value.total_projects} />
      <StatBlock label="Active projects" value={value.active_projects} />
      <StatBlock label="Completed images" value={value.completed_images} />
      <StatBlock
        label="Last activity"
        value={value.last_activity ? new Date(value.last_activity).toLocaleDateString() : '—'}
      />
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border-ghost bg-surface/60 p-3">
      <div className="text-[11px] text-text-subtle">{label}</div>
      <div className="mt-1 text-base font-semibold text-text-ink">{value}</div>
    </div>
  );
}
