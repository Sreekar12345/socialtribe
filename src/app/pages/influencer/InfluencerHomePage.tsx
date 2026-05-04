import { BarChart3, Compass, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { MetricBar } from '../../components/MetricBar';
import { ScoreCircle } from '../../components/ScoreCircle';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import {
  activityLabel,
  formatFollowers,
  formatPercent,
} from '../../utils/verification';

export function InfluencerHomePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const result = profile.verificationResult;

  if (!result) {
    return (
      <div className="space-y-4">
        <TopBar title="Home" subtitle="Complete verification to unlock your creator score." />

        <div className="rounded-[28px] border border-white/10 bg-gray-800 p-6 text-center text-white">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="mt-5 text-xl font-semibold">Verification pending</div>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Finish the profile check to see your performance dashboard.
          </p>
          <div className="mt-6">
            <Button fullWidth onClick={() => navigate('/influencer/verify')}>
              Start verification
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TopBar title="Home" subtitle="Your verification result and profile summary." />

      <div className="rounded-[28px] border border-white/10 bg-gray-800 p-6">
        <div className="flex flex-col items-center gap-5">
          <ScoreCircle value={result.score} />
          <div className="text-center">
            <div className="text-lg font-semibold text-white">
              {profile.instagramHandle || '@creator'}
            </div>
            <div className="mt-1 text-sm text-zinc-400">{result.summary}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <InfoCard icon={Compass} label="Tier" value={result.tier} />
        <InfoCard icon={BarChart3} label="Activity" value={activityLabel(result.activityLevel)} />
      </div>

      <div className="space-y-4 rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <MetricBar label="Followers" valueLabel={formatFollowers(result.followers)} progress={Math.min(100, Math.round((result.followers / 150000) * 100))} />
        <MetricBar label="Engagement rate" valueLabel={formatPercent(result.engagementRate)} progress={Math.min(100, Math.round(result.engagementRate * 10))} />
        <MetricBar label="Activity level" valueLabel={activityLabel(result.activityLevel)} progress={result.activityLevel} />
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Compass;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4 text-white">
      <Icon className="h-4 w-4 text-lime-200" />
      <div className="mt-3 text-sm font-medium">{value}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}
