import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { findRecommendedInfluencer } from '../data/campaignFlowMockData';
import { useCampaignFlow } from '../context/CampaignFlowContext';

export function BrandInfluencerProfilePage() {
  usePageTitle('Influencer Profile');

  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { selectInfluencer } = useCampaignFlow();
  const influencer = findRecommendedInfluencer(id);

  if (!influencer) {
    return (
      <div className="flex min-h-full flex-col justify-center">
        <Card className="p-8 text-center">
          <p className="text-base font-semibold text-neutral-950">
            Influencer not found
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
              {influencer.username}
            </h1>
            <p className="text-sm text-neutral-600">{influencer.category}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-[#f4ecd6] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Followers
              </p>
              <p className="mt-2 text-base font-semibold text-neutral-950">
                {influencer.followers}
              </p>
            </div>
            <div className="rounded-[22px] bg-[#ede7fb] px-4 py-3">
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

      <Card className="p-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
            Previous Work
          </h2>

          {influencer.previousWork.map((work) => (
            <div
              key={work}
              className="rounded-[22px] bg-[#eef5d8] px-4 py-3 text-sm leading-6 text-neutral-700"
            >
              {work}
            </div>
          ))}
        </div>
      </Card>

      <Button
        fullWidth
        onClick={() => {
          selectInfluencer(influencer.id);
          navigate('/brand/recommendations');
        }}
      >
        Select Influencer
      </Button>
    </div>
  );
}
