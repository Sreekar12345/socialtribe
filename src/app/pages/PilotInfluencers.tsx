import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, Search, AlertTriangle, BadgeCheck, TrendingUp, Users, Check } from 'lucide-react';
import { influencers } from '../data/influencers';
import { useCampaign } from '../context/CampaignContext';
import { inr } from '../utils/money';

const categories = ['All', 'Fitness', 'Food', 'Fashion', 'Travel', 'Beauty', 'Tech'];

const followerOptions = [
  { label: 'Any', min: 0 },
  { label: '25K+', min: 25000 },
  { label: '50K+', min: 50000 },
  { label: '100K+', min: 100000 },
];

export function PilotInfluencers() {
  const nav = useNavigate();
  const { selected, toggle, budget, category: initialCat } = useCampaign();
  const [cat, setCat] = useState(initialCat && initialCat !== 'All' ? initialCat : 'All');
  const [folIdx, setFolIdx] = useState(0);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return influencers.filter((i) => {
      if (cat !== 'All' && i.niche !== cat) return false;
      if (i.followers < followerOptions[folIdx].min) return false;
      if (query && !i.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [cat, folIdx, query]);

  const used = selected.reduce((s, id) => s + (influencers.find((i) => i.id === id)?.price ?? 0), 0);
  const remaining = budget - used;
  const over = remaining < 0;
  const usedPct = Math.min(100, Math.max(0, Math.round((used / budget) * 100)));

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <div className="text-white">Customize selection</div>
              <div className="text-xs text-white/40">{filtered.length} creators available</div>
            </div>
          </div>

          <div className={`mt-3 rounded-2xl p-3 border transition-all ${
            over ? 'bg-red-500/10 border-red-500/30' : 'bg-white/[0.03] border-white/10'
          }`}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/40 uppercase tracking-widest">Budget</span>
              <span className="text-white tabular-nums">{inr(budget)}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full transition-all ${over ? 'bg-red-400' : 'bg-white'}`} style={{ width: `${usedPct}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-white/50">Used <span className="text-white tabular-nums">{inr(used)}</span></span>
              <span className={over ? 'text-red-300' : 'text-white/50'}>
                {over ? 'Over by ' : 'Left '}
                <span className="tabular-nums">{inr(Math.abs(remaining))}</span>
              </span>
            </div>
            {over && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-300">
                <AlertTriangle className="w-3 h-3" /> You've exceeded your budget
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
            <Search className="w-4 h-4 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-sm"
            />
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border ${
                  cat === c ? 'bg-white text-black border-white' : 'bg-white/5 text-white/70 border-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setFolIdx((i) => (i + 1) % followerOptions.length)}
              className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/70 border border-white/10"
            >
              Followers: {followerOptions[folIdx].label}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 space-y-3">
        {filtered.map((inf) => {
          const isSelected = selected.includes(inf.id);
          const fits = inf.price <= remaining + (isSelected ? inf.price : 0);
          return (
            <div
              key={inf.id}
              className={`relative rounded-2xl p-4 backdrop-blur-xl transition-all ${
                isSelected
                  ? 'bg-white/[0.08] border border-white/40'
                  : 'bg-white/[0.03] border border-white/10'
              }`}
            >
              <div className="flex gap-3 items-center">
                <img src={inf.image} alt={inf.name} className="w-14 h-14 rounded-full object-cover ring-1 ring-white/10" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-white truncate">{inf.name}</span>
                    {inf.verified && <BadgeCheck className="w-4 h-4 text-white/70 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">{inf.niche}</span>
                    <span className="text-[11px] text-white/40 flex items-center gap-1"><Users className="w-3 h-3" />{inf.followersLabel}</span>
                    <span className="text-[11px] text-white/40 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{inf.engagement}%</span>
                  </div>
                  <div className="mt-1.5">
                    {fits ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 uppercase tracking-wider">Fits your budget</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-wider">Over budget</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => toggle(inf.id)}
                className={`mt-3 w-full py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {isSelected ? (<><Check className="w-4 h-4" /> Selected</>) : 'Select'}
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center text-white/40 py-12 text-sm">No creators match these filters.</div>
        )}
        <div className="h-28" />
      </div>

      {selected.length > 0 && (
        <div className="sticky bottom-0 z-20 backdrop-blur-xl bg-black/70 border-t border-white/10 px-5 py-4">
          <button
            onClick={() => nav('/campaign')}
            disabled={over}
            className="w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-between px-5 hover:bg-white/90 transition-all disabled:opacity-40"
          >
            <span className="tabular-nums">{selected.length} selected</span>
            <span className="flex items-center gap-1">Continue <ArrowRight className="w-4 h-4" /></span>
          </button>
        </div>
      )}
    </div>
  );
}
