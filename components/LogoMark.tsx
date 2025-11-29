import Image from 'next/image';
import clsx from 'clsx';

interface LogoMarkProps {
  className?: string;
  priority?: boolean;
}

export function LogoMark({ className, priority }: LogoMarkProps) {
  return (
    <span className={clsx('relative inline-flex items-center', className)}>
      <Image
        src="/logo.svg"
        alt="Render Vault"
        width={240}
        height={40}
        priority={priority}
        className="block h-full w-auto"
      />
    </span>
  );
}

