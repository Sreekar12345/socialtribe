import { useMemo } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCampaignFlow } from '../context/CampaignFlowContext';
import {
  buildPlan,
  campaignInfluencers,
  formatCurrency,
  getCampaignBudgetValue,
  getEstimatedReach,
} from '../data/campaignFlowMockData';
import { useNavigate } from 'react-router';

export function BrandRecommendationsPage() {
  usePageTitle('Recommended Influencers');

  const navigate = useNavigate();
  const { draft, setSelectedInfluencerIds } = useCampaignFlow();

  const budget = useMemo(
    () => getCampaignBudgetValue(draft.budgetRange, draft.customBudget),
    [draft.budgetRange, draft.customBudget],
  );

  const plan = useMemo(
    () =>
      buildPlan(campaignInfluencers, {
        budget,
        deliverableCounts: draft.deliverableCounts,
      }),
    [budget, draft.deliverableCounts],
  );

  const budgetTotalLabel = formatCurrency(budget);
  const estimatedReach = getEstimatedReach(plan.selected);
  const selectedInfluencerIds = plan.selected.map((influencer) => influencer.id);
  const hasValidPlan = budget > 0 && plan.selected.length > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
          Recommended Influencers
        </h1>
        <p className="text-sm leading-6 text-neutral-600">
          We recommend a budget-fit creator mix based on your campaign inputs.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex min-h-[88px] flex-col justify-center space-y-2">
          <div className="space-y-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Recommended Plan
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
              Recommended Plan for {budgetTotalLabel}
            </h2>
            <p className="text-sm leading-6 text-neutral-600">
              {plan.selected.length} Influencers Selected
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {plan.selected.length > 0 ? (
          plan.selected.map((influencer, index) => (
            <Card
              key={influencer.id}
              className={
                index % 2 === 0
                  ? 'border-transparent bg-[#eef5d8] p-5'
                  : 'border-[#c5b0f4] bg-[#f4f0fd] p-5'
              }
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-semibold text-neutral-950">
                        {influencer.username.charAt(1).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-neutral-950">
                          {influencer.username}
                        </h2>
                        <p className="text-sm text-neutral-600">
                          {influencer.category}
                        </p>
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Fits
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] bg-white/85 px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      Followers
                    </p>
                    <p className="mt-2 text-base font-semibold text-neutral-950">
                      {influencer.followers}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-white/85 px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      Engagement
                    </p>
                    <p className="mt-2 text-base font-semibold text-neutral-950">
                      {influencer.engagement}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-neutral-600">
              No influencer combination fits this setup yet. Try customizing
              your selection.
            </p>
          </Card>
        )}
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-950">
              Why This Plan
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              This plan balances engagement and reach within your budget.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-neutral-950">
              Expected Performance
            </h2>
            <p className="mt-2 text-sm font-medium text-neutral-950">
              High - est. reach {estimatedReach.toLocaleString('en-IN')}+
            </p>
          </div>
        </div>
      </Card>

      {!hasValidPlan ? (
        <p className="text-sm text-[#b42318]">
          No budget-fit plan is ready yet. Adjust your budget or customize the
          selection manually.
        </p>
      ) : null}

      <div className="space-y-3">
        <Button
          fullWidth
          disabled={!hasValidPlan}
          onClick={() => {
            setSelectedInfluencerIds(selectedInfluencerIds);
            navigate('/brand/review');
          }}
        >
          Proceed with this plan
        </Button>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => {
            setSelectedInfluencerIds(selectedInfluencerIds);
            navigate('/brand/manual-pick');
          }}
        >
          Customize selection
        </Button>
      </div>
    </div>
  );
}
