import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { formatDeliverablesSummary } from '../utils/pricing';

export function PilotSuccess() {
  const navigate = useNavigate();
  const { selected, campaign, clear } = useCampaign();
  const booked = influencers.filter((creator) => selected.includes(creator.id));
  const deliverablesLabel = formatDeliverablesSummary(campaign.deliverables) || '1 Reel + 2 Stories';

  return (
    <div className="fin-page">
      <div className="fin-card text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-foreground)]">
          <Check className="h-8 w-8" strokeWidth={2.6} />
        </div>
        <h1 className="mt-5 text-[1.9rem] font-semibold tracking-[-0.04em] text-white">Campaign funded</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {booked.length} creators booked. Funds are locked and deliverables are already in motion.
        </p>
      </div>

      <div className="fin-card">
        <div className="fin-eyebrow">What happens next</div>
        <div className="mt-4 space-y-3">
          <Step done label="Wallet payment confirmed" />
          <Step done label="Escrow hold created" />
          <Step label={`Creators notified for ${deliverablesLabel}`} />
          <Step label="Content review opens in campaigns" />
        </div>
      </div>

      <div className="fin-card">
        <div className="text-sm font-medium text-white">{campaign.name || 'Untitled campaign'}</div>
        <div className="mt-2 text-xs text-zinc-400">{deliverablesLabel}</div>
        <div className="mt-4 flex -space-x-2">
          {booked.map((creator) => (
            <img key={creator.id} src={creator.image} alt={creator.name} className="h-10 w-10 rounded-full border-2 border-zinc-950 object-cover" />
          ))}
        </div>
      </div>

      <div className="fin-sticky-actions -mx-4 space-y-3">
        <button type="button" onClick={() => navigate('/campaigns')} className="fin-button-primary w-full">
          Open campaigns <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            clear();
            navigate('/');
          }}
          className="fin-button-secondary w-full"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${done ? 'bg-lime-200 text-black' : 'border border-white/10 bg-zinc-900 text-zinc-500'}`}>
        {done ? <Check className="h-3 w-3" strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />}
      </div>
      <span className={`text-sm ${done ? 'text-white' : 'text-zinc-400'}`}>{label}</span>
    </div>
  );
}
