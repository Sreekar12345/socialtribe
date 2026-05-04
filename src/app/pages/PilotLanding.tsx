import { ArrowRight, MessageSquare, Plus, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router';
import { SectionHeader } from '../components/FintechPrimitives';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';
import { inr } from '../utils/money';
import { formatDeliverablesSummary } from '../utils/pricing';

const feedCopy = [
  'Gym routine reel with product mentions built into the hook.',
  'Cafe walkthrough post with limited-time offer and clear CTA.',
  'Style edit carousel that drives saves before launch day.',
];

export function PilotLanding() {
  const navigate = useNavigate();
  const { budgetLabel, selected, campaign } = useCampaign();

  const recommended = influencers.filter((item) => item.available).slice(0, 5);
  const feedItems = recommended.slice(0, 3);
  const selectedCreators = influencers.filter((item) => selected.includes(item.id));
  const activeCreators = selectedCreators.length ? selectedCreators : recommended.slice(0, 3);
  const deliverablesLabel = formatDeliverablesSummary(campaign.deliverables) || '1 Reel + 2 Stories';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="fin-eyebrow">Home</div>
          <h1 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.03em] text-white">Discover and book faster</h1>
        </div>
        <button type="button" onClick={() => navigate('/wallet')} className="fin-chip fin-chip-active">
          {budgetLabel} live
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => navigate('/budget')} className="fin-card text-left">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
            <Plus className="h-4 w-4" />
          </div>
          <div className="mt-4 text-sm font-medium text-white">Create campaign</div>
          <div className="mt-1 text-xs leading-5 text-zinc-400">Set a budget, pick creators, and lock the brief.</div>
        </button>
        <button type="button" onClick={() => navigate('/wallet')} className="fin-card text-left">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="mt-4 text-sm font-medium text-white">Add funds</div>
          <div className="mt-1 text-xs leading-5 text-zinc-400">Top up your wallet before you start booking creators.</div>
        </button>
      </div>

      <section>
        <SectionHeader
          title="Recommended creators"
          action={
            <button type="button" onClick={() => navigate('/explore')} className="app-section-link">
              See all
            </button>
          }
        />
        <div className="app-scroll-row">
          {recommended.map((creator) => (
            <button
              key={creator.id}
              type="button"
              onClick={() => navigate('/explore')}
              className="w-[250px] shrink-0 rounded-2xl border border-white/10 bg-gray-800 p-3 text-left"
            >
              <img src={creator.image} alt={creator.name} className="h-32 w-full rounded-xl object-cover" />
              <div className="mt-3 flex items-center gap-3">
                <img src={creator.image} alt="" className="h-10 w-10 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{creator.name}</div>
                  <div className="mt-1 text-xs text-zinc-400">
                    {creator.followersLabel} followers - {creator.engagement}% ER
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="fin-chip">{creator.niche}</span>
                <span className="text-sm font-medium text-lime-200">{inr(creator.price)}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Active campaigns"
          action={
            <button type="button" onClick={() => navigate('/campaigns')} className="app-section-link">
              Open queue
            </button>
          }
        />
        <div className="app-scroll-row">
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="w-[280px] shrink-0 rounded-2xl border border-white/10 bg-gray-800 p-4 text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="fin-badge fin-badge-success">Live</span>
              <span className="text-xs text-zinc-500">{campaign.deadline || 'Due in 4 days'}</span>
            </div>
            <div className="mt-3 text-base font-semibold text-white">{campaign.name || 'Campus creator drop'}</div>
            <div className="mt-1 text-sm text-zinc-400">{deliverablesLabel}</div>
            <div className="mt-4 flex -space-x-2">
              {activeCreators.map((creator) => (
                <img key={creator.id} src={creator.image} alt={creator.name} className="h-9 w-9 rounded-full border-2 border-zinc-950 object-cover" />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
              <span>{activeCreators.length} creators booked</span>
              <span className="text-lime-200">Track progress</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate('/inbox')}
            className="w-[240px] shrink-0 rounded-2xl border border-white/10 bg-gray-800 p-4 text-left"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="mt-4 text-base font-semibold text-white">Inbox</div>
            <div className="mt-2 text-sm leading-6 text-zinc-400">Negotiate deliverables, share feedback, and unlock revisions without leaving the app.</div>
          </button>
        </div>
      </section>

      <section>
        <SectionHeader title="Creator feed" />
        <div className="space-y-4">
          {feedItems.map((creator, index) => (
            <article key={creator.id} className="fin-card">
              <img src={creator.image} alt={creator.name} className="app-media" />
              <div className="mt-4 flex items-center gap-3">
                <img src={creator.image} alt="" className="app-avatar" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">{creator.name}</div>
                  <div className="mt-1 text-xs text-zinc-400">
                    {creator.handle} - {creator.niche}
                  </div>
                </div>
                <button type="button" onClick={() => navigate('/explore')} className="fin-chip">
                  View
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-300">{feedCopy[index]}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="fin-chip">{creator.engagement}% ER</span>
                <span className="fin-chip">{creator.followersLabel} reach</span>
                <span className="fin-chip">{inr(creator.price)} rate</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => navigate('/explore')} className="fin-button-secondary flex-1">
                  View analytics
                </button>
                <button type="button" onClick={() => navigate('/budget')} className="fin-button-primary flex-1">
                  Book now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
