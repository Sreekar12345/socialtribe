import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Shield, Clock } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { inr } from '../utils/money';
import { calculatePrice, formatDeliverablesSummary } from '../utils/pricing';

export function PilotConfirm() {
  const nav = useNavigate();
  const { selected, campaign } = useCampaign();

  const picks = selected.map((id) => influencers.find((i) => i.id === id)!).filter(Boolean);
  const deliverablesSummary = formatDeliverablesSummary(campaign.deliverables) || '1 Post';
  const subtotal = picks.reduce((sum, influencer) => {
    const amount = campaign.deliverables.length
      ? calculatePrice(influencer.price, campaign.deliverables)
      : influencer.price;
    return sum + amount;
  }, 0);
  const gst = Math.round(subtotal * 0.1);
  const total = subtotal + gst;

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-white">Confirm deal</div>
          <div className="text-xs text-white/40">Step 3 of 3</div>
        </div>
      </div>

      <div className="px-5 space-y-5 flex-1">
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 text-xs uppercase tracking-widest text-white/40">
            {campaign.name || 'Untitled campaign'} · {deliverablesSummary}
          </div>
          {picks.map((i) => (
            <div key={i.id} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
              <img src={i.image} className="w-9 h-9 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm">{i.name}</div>
                <div className="text-[11px] text-white/40">{deliverablesSummary}</div>
              </div>
              <div className="text-white tabular-nums text-sm">
                {inr(campaign.deliverables.length ? calculatePrice(i.price, campaign.deliverables) : i.price)}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <InfoTile icon={Clock} label="Timeline" value={campaign.deadline || 'Flexible'} />
          <InfoTile icon={Shield} label="Creators" value={`${picks.length} verified`} />
        </div>

        <div className="rounded-2xl p-4 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
          <div className="text-[11px] uppercase tracking-wider text-white/40 mb-2">Full breakdown</div>
          <Row label="Subtotal" value={inr(subtotal)} />
          <Row label="GST (10%)" value={inr(gst)} muted />
          <div className="h-px bg-white/10 my-3" />
          <Row label="Total" value={inr(total)} bold />
        </div>

        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 flex gap-3">
          <Lock className="w-4 h-4 text-white/70 mt-0.5 shrink-0" />
          <div className="text-sm text-white/70 leading-relaxed">
            <span className="text-white">Payment held in escrow.</span>{' '}
            <span className="text-white/50">Released to creators only after content delivery is approved.</span>
          </div>
        </div>
        <div className="h-28" />
      </div>

      <div className="sticky bottom-0 backdrop-blur-xl bg-black/70 border-t border-white/10 px-5 py-4">
        <button
          onClick={() => nav('/brand/track')}
          className="w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-between px-5 hover:bg-white/90 transition-all"
        >
          <span>Pay & Start Campaign</span>
          <span className="tabular-nums">{inr(total)}</span>
        </button>
        <p className="mt-2 text-center text-[11px] text-white/40">Secured by SocialTribe Escrow · 10% all-in fee</p>
      </div>
    </div>
  );
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`text-sm ${muted ? 'text-white/40' : 'text-white/70'}`}>{label}</span>
      <span className={`tabular-nums ${bold ? 'text-white' : muted ? 'text-white/60' : 'text-white/90'}`}>{value}</span>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl p-3 bg-white/[0.03] border border-white/10">
      <div className="flex items-center gap-2 text-white/50 text-[11px] uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="mt-1.5 text-white text-sm truncate">{value}</div>
    </div>
  );
}
