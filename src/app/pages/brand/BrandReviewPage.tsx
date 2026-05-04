import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useCampaign } from '../../context/CampaignContext';
import { influencers } from '../../data/influencers';
import { getCreatorFitLabel } from '../../utils/creatorFit';
import { inr } from '../../utils/money';
import { calculatePrice, formatDeliverablesSummary } from '../../utils/pricing';

export function BrandReviewPage() {
  const navigate = useNavigate();
  const { budget, budgetMax, campaign, selected } = useCampaign();
  const creatorFitBudget = budgetMax ?? budget;
  const selectedCreators = influencers.filter((creator) => selected.includes(creator.id));
  const total = selectedCreators.reduce((sum, creator) => {
    if (campaign.deliverables.length === 0) return sum + creator.price;
    return sum + calculatePrice(creator.price, campaign.deliverables);
  }, 0);

  return (
    <div className="fin-page">
      <TopBar left={<BackButton onClick={() => navigate('/brand/select')} />} title="Review" subtitle="Check the campaign summary before payment." />

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="fin-eyebrow">Campaign summary</div>
        <div className="mt-3 space-y-2 text-sm text-zinc-300">
          <div className="flex items-center justify-between gap-3">
            <span>Deliverables</span>
            <span>{formatDeliverablesSummary(campaign.deliverables)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Deadline</span>
            <span>{campaign.deadline}</span>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-neutral-950 p-3 text-sm text-zinc-300">{campaign.brief}</div>
      </div>

      <div className="space-y-3">
        {selectedCreators.map((creator) => (
          <div key={creator.id} className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
            <div className="flex items-center gap-3">
              <img src={creator.image} alt={creator.name} className="h-11 w-11 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">{creator.name}</div>
                <div className="mt-1 text-xs text-zinc-400">{creator.handle}</div>
              </div>
              <span className="rounded-full bg-lime-200 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-black">
                {getCreatorFitLabel(creator, creatorFitBudget)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="fin-chip">{creator.niche}</span>
              <span className="fin-chip">{creator.followersLabel}</span>
              <span className="fin-chip">{creator.engagement}% ER</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-zinc-400">Total campaign cost</span>
          <span className="text-lg font-semibold text-white">{inr(total)}</span>
        </div>
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate('/brand/checkout')}>
          Proceed to payment
        </Button>
      </div>
    </div>
  );
}
