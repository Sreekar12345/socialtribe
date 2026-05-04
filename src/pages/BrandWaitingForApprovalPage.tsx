import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCampaignFlow } from '../context/CampaignFlowContext';

export function BrandWaitingForApprovalPage() {
  usePageTitle('Waiting for approval');

  const navigate = useNavigate();
  const { resetCampaign } = useCampaignFlow();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <Card className="p-8 text-center">
        <div className="space-y-5">
          <p className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
            Waiting for influencers to accept your campaign
          </p>
          <Button
            onClick={() => {
              resetCampaign();
              navigate('/brand/dashboard');
            }}
          >
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
