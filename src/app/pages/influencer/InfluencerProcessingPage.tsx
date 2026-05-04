import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BackButton } from '../../components/FintechPrimitives';
import { MetricBar } from '../../components/MetricBar';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { buildVerificationResult } from '../../utils/verification';

export function InfluencerProcessingPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useAuth();
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    if (!profile.instagramHandle) {
      navigate('/influencer/setup', { replace: true });
      return;
    }

    if (profile.verificationStatus !== 'processing') {
      navigate('/influencer/verify', { replace: true });
      return;
    }

    const steps = [18, 31, 47, 63, 78, 89, 100];
    let index = 0;

    const interval = window.setInterval(() => {
      setProgress(steps[index] ?? 100);
      index += 1;
    }, 420);

    const timeout = window.setTimeout(() => {
      const result = buildVerificationResult(
        profile.instagramHandle,
        profile.niche ?? 'Lifestyle',
      );
      setProfile((current) => ({
        ...current,
        verificationStatus: 'ready',
        verificationResult: result,
      }));
      navigate('/influencer/home', { replace: true });
    }, 3200);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [
    navigate,
    profile.instagramHandle,
    profile.niche,
    profile.verificationStatus,
    setProfile,
  ]);

  return (
    <div className="fin-page justify-center">
      <TopBar
        left={<BackButton onClick={() => navigate('/influencer/verify')} />}
        title="Processing profile"
        subtitle="We are analyzing profile performance and building your score."
      />

      <div className="rounded-[28px] border border-white/10 bg-gray-800 p-6 text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <div className="mt-5 text-xl font-semibold text-white">
          Analyzing your profile performance...
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Followers, engagement rate, and activity level are being scored with
          mocked analysis.
        </p>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <MetricBar label="Overall progress" valueLabel={`${progress}%`} progress={progress} />
      </div>

      <div className="fin-panel-cream">
        <div className="fin-eyebrow text-black/60">In progress</div>
        <div className="mt-3 space-y-3">
          <MetricBar label="Followers" valueLabel="Collecting" progress={Math.max(12, progress - 8)} />
          <MetricBar label="Engagement" valueLabel="Scoring" progress={Math.max(8, progress - 16)} />
          <MetricBar label="Activity" valueLabel="Profiling" progress={Math.max(6, progress - 24)} />
        </div>
      </div>
    </div>
  );
}
