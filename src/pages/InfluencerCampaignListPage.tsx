import { CampaignCard } from '../components/CampaignCard';
import { useInfluencerWork } from '../context/InfluencerWorkContext';
import { usePageTitle } from '../hooks/usePageTitle';

export function InfluencerCampaignListPage() {
  usePageTitle('Your Work');
  const { campaigns } = useInfluencerWork();

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Your Work
      </h1>

      <div className="space-y-3">
        {campaigns.map((campaign, index) => (
          <CampaignCard
            key={campaign.id}
            data={campaign}
            className={
              index % 2 === 0 ? 'p-5' : 'border-[#c5b0f4] bg-[#f4f0fd] p-5'
            }
          />
        ))}
      </div>
    </div>
  );
}
