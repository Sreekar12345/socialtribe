import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Check, ExternalLink, X } from 'lucide-react';
import { influencers } from '../data/influencers';
import { BackButton, ScreenHeader } from '../components/FintechPrimitives';

export function ContentReview() {
  const nav = useNavigate();
  const { id } = useParams();
  const influencer = influencers.find((item) => item.id === id) ?? influencers[0];
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);

  return (
    <div className="fin-page">
      <BackButton onClick={() => nav(-1)} />
      <ScreenHeader
        eyebrow="Submission review"
        title={influencer.name}
        subtitle="Approve to release escrow, or reject to send the creator back for revision."
      />

      <div className="fin-card mt-2 overflow-hidden p-0">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=750&fit=crop"
            alt="submission"
            className="h-full w-full object-cover"
          />
          <div className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-black/75">
            Reel · 0:18
          </div>
        </div>
      </div>

      <div className="fin-panel-cream mt-5">
        <div className="fin-eyebrow">Caption</div>
        <p className="mt-3 text-sm leading-7 text-black/75">
          Tried the new drop today and honestly it slaps. Form factor is clean, fits in my gym bag, and the shake test passed. Link in bio. #partner
        </p>
      </div>

      <a className="fin-card mt-5 flex items-center justify-between text-sm">
        <span className="truncate text-black/60">instagram.com/p/Dx7pQa9</span>
        <ExternalLink className="h-4 w-4 text-black/40" />
      </a>

      {decision ? (
        <div className={`mt-5 rounded-[24px] p-4 text-sm ${decision === 'approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
          {decision === 'approved' ? 'Approved · funds released to creator.' : 'Rejected · creator notified to revise.'}
        </div>
      ) : null}

      <div className="fin-sticky-actions -mx-5 mt-8 flex gap-2">
        <button
          onClick={() => {
            setDecision('rejected');
            setTimeout(() => nav('/brand/track'), 600);
          }}
          className="fin-button-secondary flex-1"
        >
          <X className="h-4 w-4" /> Reject
        </button>
        <button
          onClick={() => {
            setDecision('approved');
            setTimeout(() => nav('/brand/track'), 600);
          }}
          className="fin-button-primary flex-[2]"
        >
          <Check className="h-4 w-4" /> Approve & Release
        </button>
      </div>
    </div>
  );
}
