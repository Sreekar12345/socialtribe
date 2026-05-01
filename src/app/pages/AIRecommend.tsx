import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Loader2, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { aiRecommend, inr } from '../utils/money';

export function AIRecommend() {
  const nav = useNavigate();
  const { budget, category, setSelected } = useCampaign();
  const [thinking, setThinking] = useState(true);

  const { picked, spent } = useMemo(() => aiRecommend(influencers, budget, category), [budget, category]);
  const remaining = Math.max(0, budget - spent);
  const usedPct = Math.min(100, Math.round((spent / budget) * 100));

  useEffect(() => {
    const t = setTimeout(() => setThinking(false), 1100);
    return () => clearTimeout(t);
  }, []);

  const proceed = () => {
    setSelected(picked.map((i) => i.id));
    nav('/campaign');
  };

  const customize = () => {
    setSelected(picked.map((i) => i.id));
    nav('/influencers');
  };

  if (thinking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-6">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-white/20 rounded-full" />
          <div className="relative w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-white/70 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Building your plan…
        </div>
        <div className="mt-8 space-y-1.5 text-[11px] text-white/40 text-center">
          <div>Matching {category.toLowerCase()} creators</div>
          <div>Optimizing reach × engagement</div>
          <div>Fitting {inr(budget)} budget</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Powered by SocialTribe AI
          </div>
          <div className="mt-1.5 text-white">Recommended plan for {inr(budget)}</div>
        </div>
      </div>

      <div className="px-5 space-y-4 flex-1">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 uppercase tracking-widest">Budget utilization</span>
            <span className="text-white tabular-nums">{usedPct}%</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${usedPct}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <div>
              <div className="text-white/40">Used</div>
              <div className="text-white tabular-nums mt-0.5">{inr(spent)}</div>
            </div>
            <div className="text-right">
              <div className="text-white/40">Remaining</div>
              <div className="text-white tabular-nums mt-0.5">{inr(remaining)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {picked.map((i) => (
            <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <img src={i.image} className="w-11 h-11 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm truncate">{i.name}</div>
                <div className="flex items-center gap-2 text-[11px] text-white/40 mt-0.5">
                  <span>{i.niche}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{i.followersLabel}</span>
                  <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{i.engagement}%</span>
                </div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 uppercase tracking-wider">Fits</span>
            </div>
          ))}
          {picked.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-white/40 text-sm">
              No creators fit this budget. Try a higher amount.
            </div>
          )}
        </div>

        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <Sparkles className="w-3 h-3" /> Why this plan
          </div>
          <p className="mt-2 text-sm text-white/80 leading-relaxed">
            Balances high engagement and reach across multiple audience segments to maximize visibility within your budget.
          </p>
        </div>

        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/40">Expected performance</div>
            <div className="text-white text-sm">High · est. reach 280K+</div>
          </div>
        </div>
        <div className="h-28" />
      </div>

      <div className="sticky bottom-0 backdrop-blur-xl bg-black/70 border-t border-white/10 px-5 py-4 space-y-2">
        <button
          onClick={proceed}
          disabled={picked.length === 0}
          className="w-full py-3.5 rounded-2xl bg-white text-black disabled:opacity-40"
        >
          Proceed with this plan
        </button>
        <button
          onClick={customize}
          className="w-full py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm"
        >
          Customize selection
        </button>
      </div>
    </div>
  );
}
