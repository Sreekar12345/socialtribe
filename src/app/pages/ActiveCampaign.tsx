import { useNavigate, useParams } from 'react-router';
import { Calendar, FileText, MessageSquare } from 'lucide-react';
import { BackButton, ScreenHeader } from '../components/FintechPrimitives';

export function ActiveCampaign() {
  const nav = useNavigate();
  const { id = '1' } = useParams();

  return (
    <div className="fin-page">
      <BackButton onClick={() => nav('/influencer/home')} />
      <ScreenHeader
        eyebrow="Active campaign"
        title="Acme Co. · Summer drop"
        subtitle="Review payout terms, deliverables, and the working brief before you submit content."
        actions={
          <button onClick={() => nav(`/chat/${id}`, { state: { from: `/influencer/campaign/${id}` } })} className="fin-topbar-action">
            <MessageSquare className="h-4 w-4" />
          </button>
        }
      />

      <div className="fin-panel-lime mt-2">
        <div className="fin-eyebrow">Payout</div>
        <div className="mt-2 text-[3rem] font-[340] tracking-[-0.05em] text-black">₹3,200</div>
        <div className="mt-1 text-[11px] text-black/55">Held in escrow · released on approval</div>
      </div>

      <div className="fin-card mt-5 space-y-4">
        <Row icon={FileText} label="Deliverable" value="1× Reel · 15–30s" />
        <Row icon={Calendar} label="Deadline" value="Apr 28, 2026" />
      </div>

      <div className="fin-panel-cream mt-5">
        <div className="fin-eyebrow">Brief</div>
        <p className="mt-3 text-sm leading-7 text-black/75">
          Showcase the new shaker bottle in your gym routine. Mention the leak-proof seal and tag @acme. No competing brand placements.
        </p>
      </div>

      <div className="fin-sticky-actions -mx-5 mt-8">
        <button onClick={() => nav(`/influencer/submit/${id}`)} className="fin-button-primary w-full">
          Submit content
        </button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[var(--surface-soft)]">
        <Icon className="h-4 w-4 text-black/70" />
      </div>
      <div className="flex-1">
        <div className="fin-eyebrow">{label}</div>
        <div className="mt-1 text-sm text-black">{value}</div>
      </div>
    </div>
  );
}
