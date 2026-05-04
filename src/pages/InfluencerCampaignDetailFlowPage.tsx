import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { findInfluencerOpportunity } from '../data/dashboardMockData';

export function InfluencerCampaignDetailFlowPage() {
  usePageTitle('Campaign detail');

  const navigate = useNavigate();
  const { id = '' } = useParams();
  const campaign = findInfluencerOpportunity(id);

  if (!campaign) {
    return (
      <div className="flex min-h-full flex-col justify-center">
        <Card className="p-8 text-center">
          <p className="text-base font-semibold text-neutral-950">
            Campaign not found
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
              {campaign.title}
            </h1>
            <p className="text-sm text-neutral-500">{campaign.brand}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-950">
              Description
            </h2>
            <p className="text-sm leading-6 text-neutral-600">
              {campaign.description}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-950">
              Deliverables
            </h2>
            <ul className="ml-5 list-disc space-y-2 text-sm leading-6 text-neutral-600">
              {campaign.deliverables.map((deliverable) => (
                <li key={deliverable}>{deliverable}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-950">
              Deadline
            </h2>
            <p className="text-sm leading-6 text-neutral-600">
              {campaign.deadline}
            </p>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button fullWidth onClick={() => navigate('/influencer/dashboard')}>
          Accept
        </Button>
        <Button
          variant="secondary"
          fullWidth
          onClick={() => navigate('/influencer/dashboard')}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
