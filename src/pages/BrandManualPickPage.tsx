import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useCampaignFlow } from '../context/CampaignFlowContext';
import {
  campaignInfluencers,
  formatCurrency,
  getCampaignBudgetValue,
  getSelectionCost,
} from '../data/campaignFlowMockData';
import { usePageTitle } from '../hooks/usePageTitle';

export function BrandManualPickPage() {
  usePageTitle('Select Influencers Manually');

  const navigate = useNavigate();
  const { draft, setSelectedInfluencerIds } = useCampaignFlow();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    draft.selectedInfluencerIds,
  );

  const budget = useMemo(
    () => getCampaignBudgetValue(draft.budgetRange, draft.customBudget),
    [draft.budgetRange, draft.customBudget],
  );

  const usedAmount = useMemo(
    () => getSelectionCost(selectedIds, draft.deliverableCounts),
    [draft.deliverableCounts, selectedIds],
  );

  const remainingAmount = budget - usedAmount;
  const isOverBudget = remainingAmount < 0;
  const isContinueDisabled = selectedIds.length === 0 || isOverBudget;

  function toggleInfluencer(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Select Influencers Manually
      </h1>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-[22px] bg-[#f4ecd6] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Budget Total
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {formatCurrency(budget)}
              </p>
            </div>

            <div className="rounded-[22px] bg-[#ede7fb] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Used
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {formatCurrency(usedAmount)}
              </p>
            </div>

            <div className="rounded-[22px] bg-[#eef5d8] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Remaining
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {formatCurrency(Math.max(remainingAmount, 0))}
              </p>
            </div>
          </div>

          {isOverBudget ? (
            <p className="text-sm text-[#b42318]">
              You're exceeding your budget.
            </p>
          ) : null}
        </div>
      </Card>

      <div className="space-y-3">
        {campaignInfluencers.map((influencer, index) => {
          const isSelected = selectedIds.includes(influencer.id);

          return (
            <Card
              key={influencer.id}
              className={
                isSelected
                  ? 'border-transparent bg-[#eef5d8] p-5'
                  : index % 2 === 0
                    ? 'p-5'
                    : 'border-[#c5b0f4] bg-[#f4f0fd] p-5'
              }
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-neutral-950">
                      {influencer.username}
                    </h2>
                    {isSelected ? (
                      <span className="rounded-full bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Selected
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-neutral-600">
                    {influencer.category}
                  </p>
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

                <Button
                  fullWidth
                  variant={isSelected ? 'primary' : 'secondary'}
                  onClick={() => toggleInfluencer(influencer.id)}
                >
                  {isSelected ? 'Selected' : 'Select Influencer'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        fullWidth
        disabled={isContinueDisabled}
        onClick={() => {
          setSelectedInfluencerIds(selectedIds);
          navigate('/brand/review');
        }}
      >
        Continue
      </Button>
    </div>
  );
}
