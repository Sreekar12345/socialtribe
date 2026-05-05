import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCampaignFlow } from '../context/CampaignFlowContext';

function ClockLoader() {
  return (
    <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f7f7f5]">
      <motion.div
        className="absolute inset-0 rounded-full border border-neutral-950/10"
        animate={{ scale: [1, 1.04, 1], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-3 rounded-full border border-black/10 bg-white/90" />
      <motion.div
        className="absolute h-7 w-[2px] origin-bottom rounded-full bg-neutral-950"
        style={{ bottom: '50%', left: 'calc(50% - 1px)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute h-5 w-[2px] origin-bottom rounded-full bg-neutral-500"
        style={{ bottom: '50%', left: 'calc(50% - 1px)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute h-3 w-3 rounded-full bg-neutral-950" />
    </div>
  );
}

function formatCheckedTime(value: Date) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value);
}

export function BrandWaitingForApprovalPage() {
  usePageTitle('Waiting for approval');

  const navigate = useNavigate();
  const { draft, resetCampaign } = useCampaignFlow();
  const totalInfluencers = draft.selectedInfluencerIds.length;
  const initialAcceptedCount = useMemo(() => {
    if (totalInfluencers <= 0) {
      return 0;
    }

    return Math.min(totalInfluencers, Math.max(1, Math.ceil(totalInfluencers / 3)));
  }, [totalInfluencers]);
  const [acceptedCount, setAcceptedCount] = useState(initialAcceptedCount);
  const [lastCheckedAt, setLastCheckedAt] = useState(() => new Date());

  useEffect(() => {
    setAcceptedCount(initialAcceptedCount);
    setLastCheckedAt(new Date());
  }, [initialAcceptedCount]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setLastCheckedAt(new Date());
      setAcceptedCount((current) =>
        totalInfluencers > 0 ? Math.min(totalInfluencers, current + 1) : 0,
      );
    }, 12000);

    return () => window.clearInterval(intervalId);
  }, [totalInfluencers]);

  const progressValue =
    totalInfluencers > 0 ? (acceptedCount / totalInfluencers) * 100 : 0;
  const progressLabel =
    totalInfluencers > 0
      ? `${acceptedCount} of ${totalInfluencers} influencers accepted`
      : '0 of 0 influencers accepted';

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <Card className="mx-auto w-full max-w-xl p-8 sm:p-10">
        <div className="space-y-8 text-center">
          <div className="space-y-5">
            <ClockLoader />

            <div className="space-y-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Campaign Live
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
                Waiting for influencers to respond
              </h1>
              <p className="mx-auto max-w-md text-sm leading-6 text-neutral-600">
                We&apos;re checking responses automatically and keeping your
                campaign active while creators review the brief.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-[28px] bg-[#f7f7f5] px-5 py-5 text-left">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-neutral-950">
                {progressLabel}
              </p>
              <p className="text-xs font-medium text-neutral-500">
                Auto-refresh every 12s
              </p>
            </div>

            <div className="h-3 rounded-full bg-white">
              <motion.div
                className="h-full rounded-full bg-neutral-950"
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>

            <div className="flex flex-col gap-2 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
              <p>Most campaigns get accepted within 2-6 hours</p>
              <p>Last checked at {formatCheckedTime(lastCheckedAt)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button fullWidth onClick={() => navigate('/brand/review')}>
              View Campaign
            </Button>

            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                resetCampaign();
                navigate('/brand/dashboard');
              }}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
