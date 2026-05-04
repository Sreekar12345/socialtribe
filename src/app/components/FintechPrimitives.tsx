import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from './ui/utils';

export function BackButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={cn('fin-back-button', className)}>
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="fin-topbar items-start">
      <div className="min-w-0 flex-1">
        {eyebrow ? <div className="fin-eyebrow">{eyebrow}</div> : null}
        <div className={cn('fin-heading', eyebrow ? 'mt-2' : '')}>{title}</div>
        {subtitle ? <p className="fin-subheading mt-2 max-w-[30rem]">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function BrandMark() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-foreground)]">
        ST
      </div>
      <div>
        <div className="fin-eyebrow">SocialTribe</div>
        <div className="text-sm text-zinc-400">Creator commerce app</div>
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  action,
}: {
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="app-section-row">
      <h2 className="app-section-title">{title}</h2>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
