import { MessageSquare } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useCampaign } from '../../context/CampaignContext';
import { influencers } from '../../data/influencers';
import { mockBrandCampaigns } from '../../data/mockData';
import { inr } from '../../utils/money';
import { calculatePrice, formatDeliverablesSummary } from '../../utils/pricing';

export function BrandCampaignDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { campaign, selected } = useCampaign();

  const currentCampaign = useMemo(() => {
    if (id !== 'current-campaign' || !campaign.brief) return null;
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
      brief: campaign.brief,
    };
  }, [campaign, id, selected]);

  const fallback = mockBrandCampaigns.find((item) => item.id === id) ?? mockBrandCampaigns[0];
  const detail = currentCampaign ?? { ...fallback, brief: 'Review creator responses and payment status here.' };
  const creatorNames = detail.creatorIds
    .map((creatorId) => influencers.find((creator) => creator.id === creatorId)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="fin-page">
      <TopBar left={<BackButton onClick={() => navigate('/brand/campaigns')} />} title={detail.name} subtitle={detail.status} />

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="space-y-2 text-sm text-zinc-300">
          <div className="flex items-center justify-between gap-3">
            <span>Deliverables</span>
            <span>{detail.deliverables}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Deadline</span>
            <span>{detail.deadline}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Total</span>
            <span>{inr(detail.totalCost)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="fin-eyebrow">Creators</div>
        <div className="mt-3 space-y-2 text-sm text-zinc-300">
          {creatorNames.map((name) => (
            <div key={name}>{name}</div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4 text-sm leading-6 text-zinc-300">
        {detail.brief}
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate('/brand/chat')}>
          <MessageSquare className="h-4 w-4" /> Open chat
        </Button>
      </div>
    </div>
  );
}
