import { CircleCheck, CircleEllipsis } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { mockInfluencerOffers } from '../../data/mockData';

export function InfluencerPaymentStatusPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const offer = mockInfluencerOffers.find((item) => item.id === id) ?? mockInfluencerOffers[0];
  const released = offer.paymentStatus === 'released';

  return (
    <div className="fin-page justify-center">
      <TopBar left={<BackButton onClick={() => navigate('/influencer/home')} />} title="Payment status" subtitle="See whether your payout is pending or released." />

      <div className="rounded-[28px] border border-white/10 bg-gray-800 p-6 text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
          {released ? <CircleCheck className="h-6 w-6" /> : <CircleEllipsis className="h-6 w-6" />}
        </div>
        <div className="mt-5 text-xl font-semibold text-white">{released ? 'Released' : 'Pending'}</div>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {released ? 'Your payout has been released to your wallet.' : 'The brand still needs to review the submitted content.'}
        </p>
      </div>

      <div className="mt-6">
        <Button fullWidth onClick={() => navigate('/influencer/home')}>
          Go to home
        </Button>
      </div>
    </div>
  );
}
