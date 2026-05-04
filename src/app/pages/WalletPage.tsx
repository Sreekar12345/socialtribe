import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { SectionHeader } from '../components/FintechPrimitives';
import { calculatePrice } from '../utils/pricing';
import { inr, inrShort } from '../utils/money';

export function WalletPage() {
  const navigate = useNavigate();
  const { budget, selected, campaign } = useCampaign();

  const selectedCreators = influencers.filter((item) => selected.includes(item.id));
  const lockedAmount = selectedCreators.reduce((sum, creator) => {
    if (campaign.deliverables.length === 0) return sum + creator.price;
    return sum + calculatePrice(creator.price, campaign.deliverables);
  }, 0);

  const balance = Math.max(45000, budget * 3);
  const available = Math.max(balance - lockedAmount, 0);
  const spentThisMonth = Math.max(lockedAmount, 12600);

  const transactions = [
    { id: 't1', label: 'Wallet top-up', detail: 'UPI transfer', amount: 50000, type: 'credit', time: 'Today, 10:20' },
    {
      id: 't2',
      label: campaign.name || 'Campus summer push',
      detail: 'Escrow locked for creators',
      amount: lockedAmount || 9800,
      type: 'debit',
      time: 'Today, 09:10',
    },
    { id: 't3', label: 'Creator refund', detail: 'Unused booking slot', amount: 2200, type: 'credit', time: 'Yesterday' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="fin-eyebrow">Wallet</div>
          <h1 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.03em] text-white">Money flow</h1>
        </div>
        <button type="button" onClick={() => navigate('/budget')} className="fin-button-primary">
          <Plus className="h-4 w-4" /> Add funds
        </button>
      </div>

      <div className="fin-panel-lime">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="fin-eyebrow text-black/60">Available balance</div>
            <div className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-black">{inr(available)}</div>
            <p className="mt-2 text-sm text-black/65">Ready for new bookings, boosts, and escrow funding.</p>
          </div>
          <button type="button" onClick={() => navigate('/campaigns')} className="rounded-full bg-black px-4 py-2 text-sm text-white">
            View holds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <WalletMetric label="Locked" value={inrShort(lockedAmount || 9800)} icon={ShieldCheck} />
        <WalletMetric label="Spent" value={inrShort(spentThisMonth)} icon={ArrowUpRight} />
        <WalletMetric label="Refunds" value={inrShort(2200)} icon={ArrowDownLeft} />
      </div>

      <section>
        <SectionHeader
          title="Recent transactions"
          action={
            <button type="button" onClick={() => navigate('/campaigns')} className="app-section-link">
              Export
            </button>
          }
        />
        <div className="space-y-3">
          {transactions.map((item) => (
            <button key={item.id} type="button" onClick={() => navigate('/campaigns')} className="app-list-button">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <div className="mt-1 text-xs text-zinc-400">{item.detail}</div>
                </div>
                <div className={`text-sm font-medium ${item.type === 'credit' ? 'text-emerald-300' : 'text-white'}`}>
                  {item.type === 'credit' ? '+' : '-'}
                  {inr(item.amount)}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <span>{item.time}</span>
                <span className="inline-flex items-center gap-1">
                  <ReceiptText className="h-3.5 w-3.5" /> Receipt
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function WalletMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <div className="fin-card">
      <Icon className="h-4 w-4 text-lime-200" />
      <div className="mt-3 text-sm font-medium text-white">{value}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}
