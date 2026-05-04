import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CampaignCard } from '../../components/CampaignCard';
import { Tabs } from '../../components/Tabs';
import { TopBar } from '../../components/TopBar';
import { useCampaign } from '../../context/CampaignContext';
import { influencers } from '../../data/influencers';
import { mockBrandCampaigns, type CampaignStatus } from '../../data/mockData';
import { calculatePrice, formatDeliverablesSummary } from '../../utils/pricing';

const tabOptions: Array<{ label: string; value: CampaignStatus }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

export function BrandCampaignsPage() {
  const navigate = useNavigate();
  const { campaign, selected } = useCampaign();
  const [tab, setTab] = useState<CampaignStatus>('pending');

  const currentCampaign = useMemo(() => {
    if (!campaign.brief || selected.length === 0) return null;
    return {
      id: 'current-campaign',
      name: campaign.name || 'Current campaign',
      status: 'pending' as const,
      creatorIds: selected,
      deadline: campaign.deadline,
      deliverables: formatDeliverablesSummary(campaign.deliverables),
      totalCost: influencers
        .filter((creator) => selected.includes(creator.id))
        .reduce((sum, creator) => sum + calculatePrice(creator.price, campaign.deliverables), 0),
    };
  }, [campaign, selected]);

  const campaigns = currentCampaign ? [currentCampaign, ...mockBrandCampaigns] : mockBrandCampaigns;
  const visibleCampaigns = campaigns.filter((item) => item.status === tab);

  return (
    <div className="space-y-4">
      <TopBar title="Campaigns" subtitle="Track pending, active, and completed campaigns." />

      <Tabs value={tab} onChange={setTab} options={tabOptions} />

      <div className="space-y-3">
        {visibleCampaigns.map((item) => (
          <CampaignCard
            key={item.id}
            name={item.name}
            status={item.status}
            creators={item.creatorIds
              .map((id) => influencers.find((creator) => creator.id === id)?.name)
              .filter(Boolean) as string[]}
            detail={`${item.deliverables} - ${item.deadline}`}
            onView={() => navigate(`/brand/campaigns/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
