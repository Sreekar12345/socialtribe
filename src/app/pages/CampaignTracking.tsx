import { Clock3, MessageSquare, Plus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { SectionHeader } from '../components/FintechPrimitives';
import { useCampaign } from '../context/CampaignContext';
import { useChats } from '../context/ChatContext';
import { influencers } from '../data/influencers';
import { inr } from '../utils/money';
import { calculatePrice, formatDeliverablesSummary } from '../utils/pricing';

const statusTone: Record<string, string> = {
  pending: 'fin-badge-warning',
  negotiating: 'fin-badge-info',
  active: 'fin-badge-success',
  completed: 'fin-badge-neutral',
};

export function CampaignTracking() {
  const navigate = useNavigate();
  const { campaign, selected } = useCampaign();
  const { chats } = useChats();

  const selectedCreators = influencers.filter((creator) => selected.includes(creator.id));
  const activeCreators = selectedCreators.length ? selectedCreators : influencers.slice(0, 4);
  const liveSpend = activeCreators.reduce((sum, creator) => {
    if (campaign.deliverables.length === 0) return sum + creator.price;
    return sum + calculatePrice(creator.price, campaign.deliverables);
  }, 0);

  const deliverablesLabel = formatDeliverablesSummary(campaign.deliverables) || '1 Reel + 2 Stories';
  const activeThreads = chats.slice(0, activeCreators.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="fin-eyebrow">Campaigns</div>
          <h1 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.03em] text-white">Track live collaborations</h1>
        </div>
        <button type="button" onClick={() => navigate('/budget')} className="fin-button-primary">
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      <div className="app-scroll-row">
        <button type="button" onClick={() => navigate('/campaign')} className="w-[280px] shrink-0 rounded-2xl border border-white/10 bg-gray-800 p-4 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="fin-badge fin-badge-success">Live</span>
            <span className="text-xs text-zinc-500">{campaign.deadline || 'Due in 4 days'}</span>
          </div>
          <div className="mt-3 text-base font-semibold text-white">{campaign.name || 'Campus creator drop'}</div>
          <div className="mt-1 text-sm text-zinc-400">{deliverablesLabel}</div>
          <div className="mt-4 flex items-center justify-between text-sm text-zinc-300">
            <span>{activeCreators.length} creators</span>
            <span>{inr(liveSpend || 12400)}</span>
          </div>
        </button>

        <button type="button" onClick={() => navigate('/wallet')} className="w-[240px] shrink-0 rounded-2xl border border-white/10 bg-gray-800 p-4 text-left">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="mt-4 text-base font-semibold text-white">Escrow protected</div>
          <div className="mt-2 text-sm leading-6 text-zinc-400">Funds are locked until content is approved inside the review flow.</div>
        </button>
      </div>

      <section>
        <SectionHeader
          title="Active collaborations"
          action={
            <button type="button" onClick={() => navigate('/inbox')} className="app-section-link">
              Inbox
            </button>
          }
        />
        <div className="space-y-3">
          {activeThreads.map((thread, index) => {
            const creator = activeCreators[index] || activeCreators[0];
            const deliverableCost =
              campaign.deliverables.length > 0 ? calculatePrice(creator.price, campaign.deliverables) : creator.price;

            return (
              <button
                key={thread.id}
                type="button"
                onClick={() => navigate(`/chat/${thread.id}`, { state: { from: '/campaigns' } })}
                className="app-list-button"
              >
                <div className="flex items-center gap-3">
                  <img src={creator.image} alt={creator.name} className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-white">{creator.name}</div>
                        <div className="mt-1 text-xs text-zinc-400">{deliverablesLabel}</div>
                      </div>
                      <span className={`fin-badge ${statusTone[thread.dealStatus]}`}>{thread.dealStatus}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                      <span>{inr(deliverableCost)}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" /> {campaign.deadline || 'Review by Friday'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title="Next actions" />
        <div className="space-y-3">
          <button type="button" onClick={() => navigate('/inbox')} className="app-list-button">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-medium text-white">Reply to creator questions</div>
                <div className="mt-1 text-xs text-zinc-400">Keep negotiations moving while deliverables are still fresh.</div>
              </div>
            </div>
          </button>
          <button type="button" onClick={() => navigate('/wallet')} className="app-list-button">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <div className="text-sm font-medium text-white">Review escrow holds</div>
                <div className="mt-1 text-xs text-zinc-400">Confirm enough wallet balance for revisions and additional slots.</div>
              </div>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
