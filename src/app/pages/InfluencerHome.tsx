import { useNavigate } from 'react-router';
import {
  ArrowRight, CheckCircle2, Clock, DollarSign, Flame, Inbox,
  LogOut, Sparkles, Timer, TrendingUp, Zap,
} from 'lucide-react';
import { inr, inrShort } from '../utils/money';

const earnings = {
  total: 128400,
  month: 24600,
  pending: 18200,
  paid: 110200,
};

const insights = {
  engagement: 5.9,
  views: 412000,
  likes: 38400,
  top: 'Acme Co. · Summer drop',
};

const reliability = {
  completion: 96,
  onTime: 94,
  response: '2h',
};

const offers = [
  { id: '1', brand: 'Acme Co.', amount: 3200, deliverable: 'Reel', deadline: 'Apr 28' },
  { id: '2', brand: 'Lumen Beauty', amount: 5400, deliverable: 'Post', deadline: 'May 02' },
  { id: '3', brand: 'Northwind', amount: 2100, deliverable: 'Story', deadline: 'Apr 24' },
];

export function InfluencerHome() {
  const nav = useNavigate();

  return (
    <div className="flex flex-col min-h-full pb-10">
      <div className="px-5 pt-12 flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/40">Creator</div>
          <h1 className="mt-1 text-white text-2xl tracking-tight">Welcome back</h1>
        </div>
        <button onClick={() => nav('/')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Earnings */}
      <Section title="Earnings">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-white/[0.09] to-white/[0.02] border border-white/10">
          <div className="text-xs uppercase tracking-widest text-white/40">Total earnings</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-white text-3xl tabular-nums">{inr(earnings.total)}</div>
            <span className="text-[11px] text-emerald-400">+{inrShort(earnings.month)} this month</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <MiniStat icon={Timer} label="Pending" value={inrShort(earnings.pending)} tone="amber" />
          <MiniStat icon={CheckCircle2} label="Paid out" value={inrShort(earnings.paid)} tone="emerald" />
        </div>
      </Section>

      {/* Performance */}
      <Section title="Performance">
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={TrendingUp} label="Engagement" value={`${insights.engagement}%`} />
          <Stat icon={Flame} label="Views" value={inrShort(insights.views).replace('₹','')} />
          <Stat icon={DollarSign} label="Likes" value={(insights.likes / 1000).toFixed(1) + 'K'} />
        </div>
        <div className="mt-3 rounded-xl p-4 bg-white/[0.03] border border-white/10">
          <div className="text-[11px] uppercase tracking-wider text-white/40">Top performing</div>
          <div className="mt-1 text-white text-sm">{insights.top}</div>
          <div className="text-[11px] text-white/40 mt-0.5">6.8% engagement · 92K reach</div>
        </div>
      </Section>

      {/* Pipeline */}
      <Section title="Pipeline">
        <div className="grid grid-cols-3 gap-2">
          <Pipe label="New" count={3} />
          <Pipe label="Active" count={2} />
          <Pipe label="Completed" count={14} />
        </div>
      </Section>

      {/* Offers */}
      <Section title="Incoming offers">
        <div className="space-y-2">
          {offers.map((o) => (
            <div key={o.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm">{o.brand}</div>
                  <div className="text-[11px] text-white/40 mt-0.5">1× {o.deliverable.toLowerCase()} · by {o.deadline}</div>
                </div>
                <span className="text-white tabular-nums">{inr(o.amount)}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/70 text-xs">Reject</button>
                <button
                  onClick={() => nav(`/influencer/campaign/${o.id}`)}
                  className="flex-[2] py-2 rounded-lg bg-white text-black text-xs flex items-center justify-center gap-1"
                >
                  Accept <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Reliability */}
      <Section title="Reliability">
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={CheckCircle2} label="Completion" value={`${reliability.completion}%`} />
          <Stat icon={Zap} label="On-time" value={`${reliability.onTime}%`} />
          <Stat icon={Clock} label="Response" value={reliability.response} />
        </div>
      </Section>

      {/* Growth suggestions */}
      <Section title="Grow your earnings">
        <div className="space-y-2">
          <Tip text="Reels perform 30% better than posts for your audience." />
          <Tip text="Fitness content is trending — add it to your niches." />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 mt-7">
      <div className="text-xs uppercase tracking-widest text-white/40 mb-3">{title}</div>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl p-3 bg-white/[0.03] border border-white/10">
      <Icon className="w-4 h-4 text-white/60" />
      <div className="mt-2 text-white tabular-nums">{value}</div>
      <div className="text-[11px] text-white/40">{label}</div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: 'amber' | 'emerald' }) {
  const toneClass = tone === 'amber' ? 'text-amber-300' : 'text-emerald-300';
  return (
    <div className="rounded-xl p-3 bg-white/[0.03] border border-white/10 flex items-center gap-3">
      <Icon className={`w-4 h-4 ${toneClass}`} />
      <div>
        <div className="text-[11px] text-white/40">{label}</div>
        <div className="text-white tabular-nums text-sm">{value}</div>
      </div>
    </div>
  );
}

function Pipe({ label, count }: { label: string; count: number }) {
  return (
    <div className="rounded-xl p-3 bg-white/[0.03] border border-white/10 flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/60 text-xs">
        <Inbox className="w-3.5 h-3.5" /> {label}
      </div>
      <span className="text-white tabular-nums">{count}</span>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="rounded-xl p-3 bg-white/[0.03] border border-white/10 flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-white/80" />
      </div>
      <p className="text-sm text-white/80 leading-relaxed">{text}</p>
    </div>
  );
}
