import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { recommendedInfluencers } from '../data/campaignFlowMockData';
import { useCampaignFlow } from '../context/CampaignFlowContext';

export function BrandSelectedInfluencersPage() {
  usePageTitle('Selected Influencers');

  const navigate = useNavigate();
  const { draft } = useCampaignFlow();

  const selectedInfluencers = recommendedInfluencers.filter((influencer) =>
    draft.selectedInfluencerIds.includes(influencer.id),
  );

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Selected Influencers
      </h1>

      <div className="space-y-3">
        {selectedInfluencers.length > 0 ? (
          selectedInfluencers.map((influencer) => (
            <Card key={influencer.id} className="p-5">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-neutral-950">
                  {influencer.username}
                </h2>
                <p className="text-sm text-neutral-600">
                  {influencer.category}
                </p>
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
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-neutral-600">No influencers selected yet.</p>
          </Card>
        )}
      </div>

      <Button
        fullWidth
        disabled={selectedInfluencers.length === 0}
        onClick={() => navigate('/brand/review')}
      >
        Proceed to Review
      </Button>
    </div>
  );
}
