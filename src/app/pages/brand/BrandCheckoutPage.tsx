import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useCampaign } from '../../context/CampaignContext';
import { influencers } from '../../data/influencers';
import { inr } from '../../utils/money';
import { calculatePrice } from '../../utils/pricing';

export function BrandCheckoutPage() {
  const navigate = useNavigate();
  const { campaign, selected, walletBalance, setWalletBalance } = useCampaign();
  const selectedCreators = influencers.filter((creator) => selected.includes(creator.id));
  const total = selectedCreators.reduce((sum, creator) => {
    if (campaign.deliverables.length === 0) return sum + creator.price;
    return sum + calculatePrice(creator.price, campaign.deliverables);
  }, 0);
  const canPay = walletBalance >= total;

  const addFunds = (amount: number) => setWalletBalance(walletBalance + amount);

  const pay = () => {
    if (!canPay) return;
    setWalletBalance(walletBalance - total);
    navigate('/brand/wait/current-campaign');
  };

  return (
    <div className="fin-page">
      <TopBar left={<BackButton onClick={() => navigate('/brand/review')} />} title="Checkout" subtitle="Confirm wallet balance and pay." />

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="fin-eyebrow">Wallet balance</div>
        <div className="mt-2 text-[1.9rem] font-semibold tracking-[-0.04em] text-white">{inr(walletBalance)}</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[5000, 10000, 20000].map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => addFunds(amount)}
            className="rounded-[24px] border border-white/10 bg-gray-800 p-4 text-left text-white"
          >
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
              <Plus className="h-4 w-4" />
            </div>
            <div className="mt-3 text-sm font-medium">{inr(amount)}</div>
          </button>
        ))}
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-zinc-400">Total payable</span>
          <span className="text-lg font-semibold text-white">{inr(total)}</span>
        </div>
        {!canPay ? <p className="mt-3 text-sm text-amber-200">Add funds to complete this campaign.</p> : null}
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={pay} disabled={!canPay}>
          Pay &amp; Create Campaign
        </Button>
      </div>
    </div>
  );
}
