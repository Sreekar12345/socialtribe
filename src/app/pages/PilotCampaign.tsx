import { ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BackButton, ScreenHeader } from '../components/FintechPrimitives';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { getCampaignBudgetLimit } from '../utils/campaignBudget';
import { inr } from '../utils/money';
import { calculatePrice, DELIVERABLE_OPTIONS, type DeliverableKey } from '../utils/pricing';

export function PilotCampaign() {
  const navigate = useNavigate();
  const { selected, toggle, campaign, setCampaign, budgetLabel, budgetMax } =
    useCampaign();
  const picked = influencers.filter((creator) => selected.includes(creator.id));

  const subtotal = campaign.deliverables.length
    ? picked.reduce((sum, creator) => sum + calculatePrice(creator.price, campaign.deliverables), 0)
    : picked.reduce((sum, creator) => sum + creator.price, 0);
  const overBudget = subtotal > getCampaignBudgetLimit(budgetMax);

  const toggleDeliverable = (value: DeliverableKey) => {
    if (campaign.deliverables.includes(value)) {
      setCampaign({ ...campaign, deliverables: campaign.deliverables.filter((item) => item !== value) });
      return;
    }

    setCampaign({ ...campaign, deliverables: [...campaign.deliverables, value] });
  };

  const canContinue =
    picked.length > 0 &&
    campaign.name.trim().length > 0 &&
    campaign.deadline.trim().length > 0 &&
    campaign.deliverables.length > 0 &&
    !overBudget;

  return (
    <div className="fin-page">
      <BackButton onClick={() => navigate(-1)} />
      <ScreenHeader
        eyebrow="Campaign brief"
        title="Shape the collaboration"
        subtitle="Lock the deliverables, timeline, and creator roster before payment."
      />

      <div className="fin-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="fin-eyebrow">Budget ceiling</div>
            <div className="mt-2 text-xl font-semibold text-white">{budgetLabel}</div>
          </div>
          <div className="text-right">
            <div className="fin-eyebrow">Projected spend</div>
            <div className="mt-2 text-xl font-semibold text-lime-200">{inr(subtotal)}</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {picked.map((creator) => (
          <div key={creator.id} className="fin-card">
            <div className="flex items-center gap-3">
              <img src={creator.image} alt={creator.name} className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">{creator.name}</div>
                <div className="mt-1 text-xs text-zinc-400">{creator.niche} - {creator.followersLabel}</div>
              </div>
              <button type="button" onClick={() => toggle(creator.id)} className="fin-topbar-action" aria-label="Remove creator">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="fin-card space-y-4">
        <div>
          <label className="fin-eyebrow">Campaign name</label>
          <input
            value={campaign.name}
            onChange={(event) => setCampaign({ ...campaign, name: event.target.value })}
            placeholder="Campus summer push"
            className="fin-input mt-2"
          />
        </div>

        <div>
          <label className="fin-eyebrow">Deliverables</label>
          <div className="mt-3 flex flex-wrap gap-2">
            {DELIVERABLE_OPTIONS.map((entry) => (
              <button
                key={entry.value}
                type="button"
                onClick={() => toggleDeliverable(entry.value)}
                className={`fin-chip ${campaign.deliverables.includes(entry.value) ? 'fin-chip-active' : ''}`}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="fin-eyebrow">Deadline</label>
          <input
            type="date"
            value={campaign.deadline}
            onChange={(event) => setCampaign({ ...campaign, deadline: event.target.value })}
            className="fin-input mt-2"
          />
        </div>
      </div>

      {overBudget ? (
        <div className="fin-panel-pink">
          Your selection exceeds the current budget. Remove a creator or raise the budget to continue.
        </div>
      ) : null}

      <div className="fin-sticky-actions -mx-4">
        <button type="button" disabled={!canContinue} onClick={() => navigate('/confirm')} className="fin-button-primary w-full">
          Review payment <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
