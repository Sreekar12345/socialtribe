import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { recommendedInfluencers } from '../data/campaignFlowMockData';
import { useCampaignFlow } from '../context/CampaignFlowContext';
import {
  buildCampaignSchedule,
  formatDeliverableSummary,
  getCampaignDurationDays,
} from '../utils/campaignSchedule';

function formatCampaignDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function formatScheduleDate(startDate: string, day: number) {
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + day - 1);

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function BrandCampaignReviewFlowPage() {
  usePageTitle('Review Campaign');

  const navigate = useNavigate();
  const { draft } = useCampaignFlow();

  const selectedInfluencers = recommendedInfluencers.filter((influencer) =>
    draft.selectedInfluencerIds.includes(influencer.id),
  );
  const deliverableSummary = formatDeliverableSummary(draft.deliverableCounts);
  const schedule = buildCampaignSchedule({
    influencers: selectedInfluencers.map((influencer) => ({
      id: influencer.id,
      name: influencer.username,
      score: influencer.engagementRate,
    })),
    deliverableCounts: draft.deliverableCounts,
    durationDays: getCampaignDurationDays(draft.startDate, draft.endDate),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Review Campaign
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
          <div className="rounded-[22px] bg-[#ede7fb] px-4 py-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Description
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-950">
              {draft.description || 'Not provided'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-[#eef5d8] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Deliverables
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {deliverableSummary}
              </p>
            </div>
            <div className="rounded-[22px] bg-white px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Campaign Duration
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {draft.startDate && draft.endDate
                  ? `${formatCampaignDate(draft.startDate)} - ${formatCampaignDate(draft.endDate)}`
                  : 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
              Distribution Schedule
            </h2>
            <span className="text-sm text-neutral-500">
              {schedule.totalDeliverables} tasks over {schedule.durationDays} days
            </span>
          </div>

          {schedule.schedule.length > 0 ? (
            schedule.schedule.map((entry, index) => (
              <div
                key={`${entry.day}-${entry.influencer}-${entry.content}-${index}`}
                className="rounded-[22px] bg-[#f7f7f5] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-950">
                      Day {entry.day} -{' '}
                      {draft.startDate
                        ? formatScheduleDate(draft.startDate, entry.day)
                        : `Slot ${index + 1}`}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {entry.influencer}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    {entry.content}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-600">
              Add deliverables, dates, and influencers to generate a schedule.
            </p>
          )}

          {schedule.warnings.map((warning) => (
            <p key={warning} className="text-sm text-[#b42318]">
              {warning}
            </p>
          ))}
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

      <Button fullWidth onClick={() => navigate('/brand/payment')}>
        Proceed to Payment
      </Button>
    </div>
  );
}
