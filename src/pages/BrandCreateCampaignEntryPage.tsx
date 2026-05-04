import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCampaignFlow } from '../context/CampaignFlowContext';

export function BrandCreateCampaignEntryPage() {
  usePageTitle('Create campaign');

  const navigate = useNavigate();
  const { resetCampaign } = useCampaignFlow();

  return (
    <div className="flex h-[70vh] items-center justify-center">
      <Button
        onClick={() => {
          resetCampaign();
          navigate('/brand/create/brief');
        }}
      >
        Create New Campaign
      </Button>
    </div>
  );
}
