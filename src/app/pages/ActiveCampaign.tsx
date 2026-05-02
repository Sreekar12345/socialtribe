import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Calendar, FileText, MessageSquare } from 'lucide-react';

export function ActiveCampaign() {
  const nav = useNavigate();
  const { id = '1' } = useParams();

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav('/influencer/home')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-white/40">Active campaign</div>
          <div className="text-white">Acme Co. · Summer drop</div>
        </div>
        <button onClick={() => nav(`/chat/${id}`, { state: { from: `/influencer/campaign/${id}` } })} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      <div className="px-5 space-y-4 flex-1">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10">
          <div className="text-xs uppercase tracking-widest text-white/40">Payout</div>
          <div className="mt-1 text-white text-3xl tabular-nums">$320</div>
          <div className="mt-1 text-[11px] text-white/50">Held in escrow · released on approval</div>
        </div>

        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10 space-y-3">
          <Row icon={FileText} label="Deliverable" value="1× Reel · 15–30s" />
          <Row icon={Calendar} label="Deadline" value="Apr 28, 2026" />
        </div>

        <div className="rounded-2xl p-4 bg-white/[0.03] border border-white/10">
          <div className="text-xs uppercase tracking-widest text-white/40 mb-2">Brief</div>
          <p className="text-sm text-white/80 leading-relaxed">
            Showcase the new shaker bottle in your gym routine. Mention the leak-proof seal and tag @acme. No competing brand placements.
          </p>
        </div>
        <div className="h-28" />
      </div>

      <div className="sticky bottom-0 backdrop-blur-xl bg-black/70 border-t border-white/10 px-5 py-4">
        <button
          onClick={() => nav(`/influencer/submit/${id}`)}
          className="w-full py-3.5 rounded-2xl bg-white text-black"
        >
          Submit Content
        </button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-white/70" />
      </div>
      <div className="flex-1">
        <div className="text-[11px] uppercase tracking-wider text-white/40">{label}</div>
        <div className="text-white text-sm">{value}</div>
      </div>
    </div>
  );
}
