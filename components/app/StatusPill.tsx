import clsx from 'clsx';
import { Badge } from '../ui/Badge';
import {
  IMAGE_STATUS_CONFIG,
  PROJECT_STATUS_CONFIG,
  VERSION_STATUS_CONFIG,
  type ImageStatus,
  type ProjectStatus,
  type VersionStatus,
} from '../../lib/status';

type StatusKind = 'project' | 'image' | 'version';

type StatusPillProps =
  | { kind: 'project'; status: ProjectStatus }
  | { kind: 'image'; status: ImageStatus }
  | { kind: 'version'; status: VersionStatus };

function getStatusConfig(kind: StatusKind, status: string) {
  if (kind === 'project') return PROJECT_STATUS_CONFIG[status as ProjectStatus];
  if (kind === 'image') return IMAGE_STATUS_CONFIG[status as ImageStatus];
  return VERSION_STATUS_CONFIG[status as VersionStatus];
}

export function StatusPill(props: StatusPillProps) {
  const config = getStatusConfig(props.kind, props.status);

  if (!config) {
    return (
      <Badge className="border border-border-ghost bg-surface text-text-subtle">
        {props.status}
      </Badge>
    );
  }

  return <Badge className={clsx('px-2.5 py-1 text-[11px] font-semibold', config.className)}>{config.label}</Badge>;
}

