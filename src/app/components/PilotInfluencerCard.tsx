import { BadgeCheck, TrendingUp, Users, Check } from 'lucide-react';
import { Influencer } from '../data/influencers';

interface Props {
  inf: Influencer;
  selected: boolean;
  onToggle: () => void;
}

export function PilotInfluencerCard({ inf, selected, onToggle }: Props) {
  return (
    <div
      className={`relative rounded-2xl p-4 backdrop-blur-xl transition-all ${
        selected
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
            <span className="text-[11px] text-white/40">· {inf.completion}% on-time</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            {inf.verified && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 uppercase tracking-wider">Verified</span>
            )}
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${inf.available ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/5 text-white/40'}`}>
              {inf.available ? 'Available' : 'Booked'}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-white tabular-nums">${inf.price}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-wider">fixed</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`mt-3 w-full py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
          selected
            ? 'bg-white text-black'
            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
        }`}
      >
        {selected ? (<><Check className="w-4 h-4" /> Selected</>) : 'Select'}
      </button>
    </div>
  );
}
