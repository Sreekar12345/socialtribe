import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import {
  formatCurrency,
  recommendedInfluencers,
} from '../data/campaignFlowMockData';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCampaignFlow } from '../context/CampaignFlowContext';
import { formatDeliverableSummary } from '../utils/campaignSchedule';

export function BrandPaymentPage() {
  usePageTitle('Complete Payment');

  const navigate = useNavigate();
  const { draft } = useCampaignFlow();

  const selectedInfluencers = recommendedInfluencers.filter((influencer) =>
    draft.selectedInfluencerIds.includes(influencer.id),
  );

  const budgetLabel = draft.customBudget.trim()
    ? formatCurrency(Number.parseInt(draft.customBudget.trim(), 10) || 0)
    : draft.budgetRange || 'Not set';
  const deliverableSummary = formatDeliverableSummary(draft.deliverableCounts);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Complete Payment
      </h1>

      <Card className="p-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
            Campaign Summary
          </h2>
          <div className="rounded-[22px] bg-[#f4ecd6] px-4 py-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Title
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-950">
              {draft.title || 'Not provided'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-[#ede7fb] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Budget
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {budgetLabel}
              </p>
            </div>
            <div className="rounded-[22px] bg-[#eef5d8] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Deliverables
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {deliverableSummary}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
            Selected Influencers
          </h2>
          {selectedInfluencers.length > 0 ? (
            selectedInfluencers.map((influencer) => (
              <div
                key={influencer.id}
                className="rounded-[22px] bg-[#f7f7f5] px-4 py-3"
              >
                <p className="text-sm font-semibold text-neutral-950">
                  {influencer.username}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {influencer.category}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-600">No influencers selected.</p>
          )}
        </div>
      </Card>

      <Button fullWidth onClick={() => navigate('/brand/waiting')}>
        Pay &amp; Launch Campaign
      </Button>
    </div>
  );
}
