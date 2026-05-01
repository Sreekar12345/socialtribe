import { useNavigate } from 'react-router';
import { ArrowRight, BadgeCheck, Lock, Zap } from 'lucide-react';

export function PilotLanding() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center tabular-nums">S</div>
        <span className="text-white tracking-wide">SocialTribe</span>
      </div>

      <div className="mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Live marketplace · 2,400+ creators
        </div>
        <h1 className="mt-6 text-white text-[40px] leading-[1.1] tracking-tight">
          Hire 10 Influencers<br />
          <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">in 5 minutes.</span>
        </h1>
        <p className="mt-5 text-white/60 leading-relaxed">
          No DMs. No negotiation chaos. Fixed pricing. Instant booking.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-3">
        {[
          { icon: BadgeCheck, label: 'Verified creators' },
          { icon: Lock, label: 'Escrow payments' },
          { icon: Zap, label: 'Instant booking' },
        ].map((t) => (
          <div key={t.label} className="rounded-xl bg-white/[0.03] border border-white/10 p-3 flex flex-col items-start gap-2">
            <t.icon className="w-4 h-4 text-white/80" />
            <span className="text-[11px] text-white/60 leading-tight">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
        <div className="text-xs text-white/40 uppercase tracking-widest">Transparent pricing</div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-white tabular-nums text-2xl">10%</div>
            <div className="text-white/50 text-xs mt-1">platform fee · all-in</div>
          </div>
          <div className="text-right">
            <div className="text-white tabular-nums text-2xl">~48h</div>
            <div className="text-white/50 text-xs mt-1">avg delivery</div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <button
        onClick={() => nav('/role')}
        className="mt-10 w-full py-4 rounded-2xl bg-white text-black flex items-center justify-center gap-2 hover:bg-white/90 transition-all"
      >
        Start Hiring <ArrowRight className="w-4 h-4" />
      </button>
      <p className="mt-3 text-center text-xs text-white/40">No sign-up. Browse 2,400+ verified creators.</p>
    </div>
  );
}
