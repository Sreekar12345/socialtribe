import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { inr } from '../utils/money';

const deliverables: Array<'Story' | 'Post' | 'Reel'> = ['Story', 'Post', 'Reel'];

export function PilotCampaign() {
  const nav = useNavigate();
  const { selected, toggle, campaign, setCampaign, budget } = useCampaign();

  const picks = selected.map((id) => influencers.find((i) => i.id === id)!).filter(Boolean);
  const subtotal = picks.reduce((s, i) => s + i.price, 0);
  const over = subtotal > budget;

  const canProceed = picks.length > 0 && campaign.name.trim() && campaign.deadline && !over;

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-white">Build campaign</div>
          <div className="text-xs text-white/40">Step 2 of 3</div>
        </div>
      </div>

      <div className="px-5 space-y-6 flex-1">
        <div className="rounded-2xl p-3 bg-white/[0.03] border border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-white/50 uppercase tracking-widest">Budget</span>
          <span className="text-white tabular-nums">{inr(budget)}</span>
        </div>

        <div>
          <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Selected ({picks.length})</div>
          <div className="space-y-2">
            {picks.map((i) => (
              <div key={i.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <img src={i.image} className="w-9 h-9 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate">{i.name}</div>
                  <div className="text-[11px] text-white/40">{i.niche} · {i.followersLabel}</div>
                </div>
                <button onClick={() => toggle(i.id)} className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {picks.length === 0 && (
              <div className="text-center text-white/40 text-sm py-8 rounded-xl border border-dashed border-white/10">
                No creators selected.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/40">Campaign name</label>
            <input
              value={campaign.name}
              onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
              placeholder="Summer drop 2026"
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-white/30 text-sm"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-white/40">Deliverable</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {deliverables.map((d) => (
                <button
                  key={d}
                  onClick={() => setCampaign({ ...campaign, deliverable: d })}
                  className={`py-3 rounded-xl text-sm border transition-all ${
                    campaign.deliverable === d
                      ? 'bg-white text-black border-white'
                      : 'bg-white/[0.03] text-white/70 border-white/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-white/40">Deadline</label>
            <input
              type="date"
              value={campaign.deadline}
              onChange={(e) => setCampaign({ ...campaign, deadline: e.target.value })}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white outline-none focus:border-white/30 text-sm"
            />
          </div>
        </div>

        {over && (
          <div className="rounded-xl p-3 bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-sm text-red-300">
            <AlertTriangle className="w-4 h-4" /> Selection exceeds your {inr(budget)} budget.
          </div>
        )}
        <div className="h-28" />
      </div>

      <div className="sticky bottom-0 backdrop-blur-xl bg-black/70 border-t border-white/10 px-5 py-4">
        <button
          disabled={!canProceed}
          onClick={() => nav('/confirm')}
          className="w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2 disabled:opacity-40"
        >
          Proceed to Confirm <ArrowRight className="w-4 h-4" />
        </button>
        <p className="mt-2 text-center text-[11px] text-white/40">Full pricing revealed at payment</p>
      </div>
    </div>
  );
}
