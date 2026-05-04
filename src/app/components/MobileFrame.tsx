import type { ReactNode } from 'react';

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-zinc-950 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col overflow-hidden bg-zinc-950 md:min-h-[920px] md:rounded-[2rem] md:border md:border-white/10 md:shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="relative flex-1 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
