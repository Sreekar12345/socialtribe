import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Check, X, ExternalLink } from 'lucide-react';
import { influencers } from '../data/influencers';

export function ContentReview() {
  const nav = useNavigate();
  const { id } = useParams();
  const inf = influencers.find((i) => i.id === id) ?? influencers[0];
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-xs uppercase tracking-widest text-white/40">Review submission</div>
          <div className="text-white">{inf.name}</div>
        </div>
      </div>

      <div className="px-5 space-y-4 flex-1">
        <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=750&fit=crop"
            alt="submission"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded-full bg-black/60 text-white/80 backdrop-blur uppercase tracking-wider">
            Reel · 0:18
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10">
          <div className="text-xs uppercase tracking-widest text-white/40">Caption</div>
          <p className="mt-2 text-white/80 text-sm leading-relaxed">
            Tried the new drop today and honestly it slaps. Form factor is clean, fits in my gym bag, and the shake test passed. Link in bio. #partner
          </p>
        </div>

        <a className="rounded-2xl p-3 bg-white/[0.03] border border-white/10 flex items-center justify-between text-sm">
          <span className="text-white/60 truncate">instagram.com/p/Dx7pQa9</span>
          <ExternalLink className="w-4 h-4 text-white/40" />
        </a>

        {decision && (
          <div className={`rounded-xl p-3 text-sm ${decision === 'approved' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/5 text-white/60'}`}>
            {decision === 'approved' ? 'Approved · funds released to creator.' : 'Rejected · creator notified to revise.'}
          </div>
        )}
        <div className="h-28" />
      </div>

      <div className="sticky bottom-0 backdrop-blur-xl bg-black/70 border-t border-white/10 px-5 py-4 flex gap-2">
        <button
          onClick={() => { setDecision('rejected'); setTimeout(() => nav('/brand/track'), 600); }}
          className="flex-1 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" /> Reject
        </button>
        <button
          onClick={() => { setDecision('approved'); setTimeout(() => nav('/brand/track'), 600); }}
          className="flex-[2] py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> Approve & Release
        </button>
      </div>
    </div>
  );
}
