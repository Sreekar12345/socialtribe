import { ArrowRight, CheckCircle2, Inbox, Sparkles, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BackButton, ScreenHeader, SectionHeader } from '../components/FintechPrimitives';
import { inr, inrShort } from '../utils/money';

const offers = [
  { id: '1', brand: 'Acme Co.', deliverable: '1 Reel + 2 Stories', amount: 3200, deadline: 'May 07' },
  { id: '2', brand: 'Northwind', deliverable: '1 Post + 1 Story', amount: 5400, deadline: 'May 10' },
];

export function InfluencerHome() {
  const navigate = useNavigate();

  return (
    <div className="fin-page">
      <BackButton onClick={() => navigate('/profile')} />
      <ScreenHeader
        eyebrow="Creator workspace"
        title="Manage offers and payouts"
        subtitle="Keep delivery moving, reply to brands, and watch wallet activity from one place."
        actions={
          <button type="button" onClick={() => navigate('/inbox')} className="fin-topbar-action">
            <Inbox className="h-4 w-4" />
          </button>
        }
      />

      <div className="fin-panel-lime">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="fin-eyebrow text-black/60">Available to withdraw</div>
            <div className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-black">{inr(18200)}</div>
            <p className="mt-2 text-sm text-black/65">Live after approvals land in your wallet.</p>
          </div>
          <button type="button" onClick={() => navigate('/wallet')} className="rounded-full bg-black px-4 py-2 text-sm text-white">
            Wallet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MiniStat label="Pending" value={inrShort(5400)} />
        <MiniStat label="Live" value="2 briefs" />
        <MiniStat label="On-time" value="96%" />
      </div>

      <section>
        <SectionHeader title="Incoming offers" />
        <div className="space-y-3">
          {offers.map((offer) => (
            <div key={offer.id} className="fin-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white">{offer.brand}</div>
                  <div className="mt-1 text-xs text-zinc-400">{offer.deliverable} - due {offer.deadline}</div>
                </div>
                <span className="text-sm font-medium text-lime-200">{inr(offer.amount)}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => navigate('/inbox')} className="fin-button-secondary flex-1">
                  Reply
                </button>
                <button type="button" onClick={() => navigate(`/influencer/campaign/${offer.id}`)} className="fin-button-primary flex-1">
                  Accept <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Quick actions" />
        <div className="space-y-3">
          <QuickAction label="Check approvals" detail="Review content status before payout release" icon={CheckCircle2} to="/campaigns" />
          <QuickAction label="Open wallet" detail="Track payouts, holds, and refunds" icon={Wallet} to="/wallet" />
          <QuickAction label="Grow your profile" detail="Connect verification and improve response speed" icon={Sparkles} to="/role" />
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="fin-card">
      <div className="text-sm font-medium text-white">{value}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}

function QuickAction({
  label,
  detail,
  icon: Icon,
  to,
}: {
  label: string;
  detail: string;
  icon: typeof CheckCircle2;
  to: string;
}) {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(to)} className="app-list-button">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-sm font-medium text-white">{label}</div>
          <div className="mt-1 text-xs text-zinc-400">{detail}</div>
        </div>
      </div>
    </button>
  );
}
