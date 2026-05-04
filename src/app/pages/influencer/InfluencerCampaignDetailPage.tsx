import { CalendarDays, FileText, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { mockInfluencerOffers } from '../../data/mockData';

export function InfluencerCampaignDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const offer = mockInfluencerOffers.find((item) => item.id === id) ?? mockInfluencerOffers[0];

  return (
    <div className="fin-page">
      <TopBar
        left={<BackButton onClick={() => navigate('/influencer/offers')} />}
        title={offer.brandName}
        subtitle="Instructions, deliverables, and timeline."
        actions={
          <button type="button" onClick={() => navigate(`/influencer/chat/${offer.id}`)} className="fin-topbar-action">
            <MessageSquare className="h-4 w-4" />
          </button>
        }
      />

      <div className="fin-panel-lime">
        <div className="fin-eyebrow text-black/60">Campaign brief</div>
        <div className="mt-2 text-sm leading-6 text-black/75">
          Review the collaboration instructions and timeline before you submit content.
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="space-y-4 text-sm text-zinc-300">
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-lime-200" />
            <span>{offer.deliverables}</span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-lime-200" />
            <span>{offer.deadline}</span>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4 text-sm leading-6 text-zinc-300">
        {offer.instructions}
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate(`/influencer/execute/${offer.id}`)}>
          Upload content
        </Button>
      </div>
    </div>
  );
}
