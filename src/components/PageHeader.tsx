import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              {title}
            </h1>
            <p className="max-w-sm text-sm leading-6 text-zinc-400">
              {description}
            </p>
          </div>
        </div>
        {action}
      </div>
    </header>
  );
}
