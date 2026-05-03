import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Check, ArrowRight } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { formatDeliverablesSummary } from '../utils/pricing';

export function PilotSuccess() {
  const nav = useNavigate();
  const { selected, campaign, clear } = useCampaign();
  const picks = selected.map((id) => influencers.find((i) => i.id === id)!).filter(Boolean);
  const deliverablesSummary = formatDeliverablesSummary(campaign.deliverables) || '1 Post';

  const delivery = campaign.deadline
    ? new Date(campaign.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : '48h';

  useEffect(() => {
    return () => {
      // keep state during view; parent unmount clears when user leaves
    };
  }, []);

  return (
    <div className="flex flex-col min-h-full px-6 pt-20 pb-8">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-white/30 rounded-full" />
          <div className="relative w-20 h-20 rounded-full bg-white text-black flex items-center justify-center">
            <Check className="w-9 h-9" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="mt-8 text-white text-3xl tracking-tight">Campaign live</h1>
        <p className="mt-3 text-white/50 leading-relaxed">
          {picks.length} creators booked. Payment is in escrow and released on delivery.
        </p>
      </div>

      <div className="mt-10 rounded-2xl p-4 bg-white/[0.03] border border-white/10">
        <div className="text-xs uppercase tracking-widest text-white/40 mb-3">
          {campaign.name || 'Campaign'} · {deliverablesSummary}
        </div>
        <div className="flex -space-x-3 mb-3">
          {picks.slice(0, 6).map((i) => (
            <img key={i.id} src={i.image} className="w-10 h-10 rounded-full ring-2 ring-black object-cover" />
          ))}
          {picks.length > 6 && (
            <div className="w-10 h-10 rounded-full ring-2 ring-black bg-white/10 text-white/70 flex items-center justify-center text-xs">
              +{picks.length - 6}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/40">Booked</div>
            <div className="text-white mt-1 tabular-nums">{picks.length} creators</div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-white/40">Delivery by</div>
            <div className="text-white mt-1">{delivery}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Step done label="Payment received · held in escrow" />
        <Step label="Creators notified · briefs sent" />
        <Step label="Content delivered" />
        <Step label="Funds released" />
      </div>

      <div className="flex-1" />

      <button
        onClick={() => nav('/brand/track')}
        className="mt-10 w-full py-4 rounded-2xl bg-white text-black flex items-center justify-center gap-2"
      >
        Track progress <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={() => {
          clear();
          nav('/');
        }}
        className="mt-3 w-full py-3 text-white/50 text-sm"
      >
        Back to home
      </button>
    </div>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-white text-black' : 'bg-white/10 text-white/30 border border-white/10'}`}>
        {done ? <Check className="w-3 h-3" strokeWidth={3} /> : <span className="w-1.5 h-1.5 rounded-full bg-white/40" />}
      </div>
      <span className={`text-sm ${done ? 'text-white' : 'text-white/50'}`}>{label}</span>
    </div>
  );
}
