import { ReactNode } from 'react';

export function MobileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center md:p-8">
      <div className="relative w-full max-w-[420px] min-h-screen md:min-h-[860px] md:h-[860px] md:rounded-[2.5rem] md:border md:border-white/10 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a] shadow-2xl">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative h-full overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}
