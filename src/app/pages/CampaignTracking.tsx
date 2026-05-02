import { useNavigate } from 'react-router';
import { ArrowLeft, Inbox, MessageSquare } from 'lucide-react';
import { useCampaign } from '../context/CampaignContext';
import { influencers } from '../data/influencers';

type Status = 'Pending' | 'Accepted' | 'In Progress' | 'Submitted' | 'Approved';

const STATUS_ORDER: Status[] = ['Pending', 'Accepted', 'In Progress', 'Submitted', 'Approved'];

const statusForIndex = (i: number): Status => STATUS_ORDER[i % STATUS_ORDER.length];

const statusTone: Record<Status, string> = {
  Pending: 'bg-white/5 text-white/50',
  Accepted: 'bg-blue-500/15 text-blue-300',
  'In Progress': 'bg-amber-500/15 text-amber-300',
  Submitted: 'bg-violet-500/15 text-violet-300',
  Approved: 'bg-emerald-500/15 text-emerald-300',
};

export function CampaignTracking() {
  const nav = useNavigate();
  const { selected, campaign } = useCampaign();
  const picks = selected.map((id) => influencers.find((i) => i.id === id)!).filter(Boolean);

  const list = picks.length ? picks : influencers.slice(0, 4);

  const statuses = list.map((_, i) => statusForIndex(i + 1));
  const approved = statuses.filter((s) => s === 'Approved').length;
  const progress = list.length ? Math.round((approved / list.length) * 100) : 0;

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav('/influencers')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-white/40">Campaign</div>
          <div className="text-white">{campaign.name || 'Untitled'} - {campaign.deliverable || 'Post'}</div>
        </div>
        <button onClick={() => nav('/inbox')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <Inbox className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40 uppercase tracking-widest">Progress</span>
            <span className="text-white tabular-nums">{approved}/{list.length} approved</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="px-5 mt-5 space-y-2 pb-8">
        <div className="text-xs uppercase tracking-widest text-white/40 mb-1">Creators</div>
        {list.map((inf, i) => {
          const s = statuses[i];
          const canReview = s === 'Submitted';
          return (
            <div key={inf.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
              <img src={inf.image} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm truncate">{inf.name}</div>
                <span className={`mt-1 inline-block text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${statusTone[s]}`}>{s}</span>
              </div>
              <button
                onClick={() => nav(`/chat/${inf.id}`, { state: { from: '/brand/track' } })}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60"
                aria-label="Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              {canReview ? (
                <button
                  onClick={() => nav(`/brand/review/${inf.id}`)}
                  className="px-3 py-1.5 rounded-full bg-white text-black text-xs"
                >
                  Review
                </button>
              ) : (
                <span className="text-white/40 tabular-nums text-sm">${inf.price}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
