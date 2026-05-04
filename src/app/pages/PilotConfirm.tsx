import { Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BackButton, ScreenHeader } from '../components/FintechPrimitives';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { inr } from '../utils/money';
import { calculatePrice, formatDeliverablesSummary } from '../utils/pricing';

export function PilotConfirm() {
  const navigate = useNavigate();
  const { selected, campaign } = useCampaign();

  const picked = influencers.filter((creator) => selected.includes(creator.id));
  const deliverablesLabel = formatDeliverablesSummary(campaign.deliverables) || '1 Reel + 2 Stories';
  const subtotal = picked.reduce((sum, creator) => {
    if (campaign.deliverables.length === 0) return sum + creator.price;
    return sum + calculatePrice(creator.price, campaign.deliverables);
  }, 0);
  const fee = Math.round(subtotal * 0.1);
  const total = subtotal + fee;

  return (
    <div className="fin-page">
      <BackButton onClick={() => navigate(-1)} />
      <ScreenHeader
        eyebrow="Review payment"
        title="Confirm and fund"
        subtitle="Check creator allocations and lock the wallet amount into escrow."
      />

      <div className="fin-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="fin-eyebrow">Campaign</div>
            <div className="mt-2 text-base font-semibold text-white">{campaign.name || 'Untitled campaign'}</div>
          </div>
          <span className="fin-badge fin-badge-success">{deliverablesLabel}</span>
        </div>

        <div className="mt-4 space-y-3">
          {picked.map((creator) => (
            <div key={creator.id} className="flex items-center gap-3 rounded-xl bg-zinc-900 px-3 py-3">
              <img src={creator.image} alt={creator.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">{creator.name}</div>
                <div className="mt-1 text-xs text-zinc-400">{creator.handle}</div>
              </div>
              <div className="text-sm text-white">
                {inr(campaign.deliverables.length ? calculatePrice(creator.price, campaign.deliverables) : creator.price)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fin-panel-lime">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="fin-eyebrow text-black/60">Total to lock</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-black">{inr(total)}</div>
          </div>
          <div className="rounded-full bg-black px-3 py-1.5 text-xs text-white">Escrow</div>
        </div>
        <div className="mt-4 space-y-2 text-sm text-black/70">
          <Row label="Creator subtotal" value={inr(subtotal)} />
          <Row label="Platform fee" value={inr(fee)} />
        </div>
      </div>

      <div className="fin-card">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-white">Escrow protection</div>
            <div className="mt-2 text-sm leading-6 text-zinc-400">
              Funds stay locked until content is reviewed and approved inside the app.
            </div>
          </div>
          <Lock className="mt-1 h-4 w-4 text-zinc-500" />
        </div>
      </div>

      <div className="fin-sticky-actions -mx-4">
        <button type="button" onClick={() => navigate('/success')} className="fin-button-primary w-full">
          Pay and launch {inr(total)}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className="font-medium text-black">{value}</span>
    </div>
  );
}
