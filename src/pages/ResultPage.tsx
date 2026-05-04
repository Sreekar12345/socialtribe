import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ScoreCircle } from '../components/ScoreCircle';
import { usePageTitle } from '../hooks/usePageTitle';

export function ResultPage() {
  usePageTitle('Result');
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-col justify-center pb-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="space-y-4"
      >
        <Card className="p-6">
          <div className="flex flex-col items-center gap-5">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
              Your Score
            </h1>
            <ScoreCircle value={78} />
            <p className="text-base font-medium text-neutral-700">
              Category: Micro Influencer
            </p>
          </div>
        </Card>

        <Card variant="soft" className="p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-600">Followers</span>
              <span className="text-sm font-semibold text-neutral-950">
                12,400
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-600">Engagement</span>
              <span className="text-sm font-semibold text-neutral-950">
                4.2%
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-600">Activity</span>
              <span className="text-sm font-semibold text-neutral-950">
                High
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-950">
              Content Strength
            </h2>

            <div className="space-y-3">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <span className="text-sm text-neutral-700">Reel</span>
                <div className="h-2 overflow-hidden rounded-full bg-black/10">
                  <div className="h-full w-[88%] rounded-full bg-neutral-950" />
                </div>
                <span className="text-sm font-semibold text-neutral-950">
                  High Impact
                </span>
              </div>

              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <span className="text-sm text-neutral-700">Post</span>
                <div className="h-2 overflow-hidden rounded-full bg-black/10">
                  <div className="h-full w-[58%] rounded-full bg-neutral-950" />
                </div>
                <span className="text-sm font-semibold text-neutral-950">
                  Medium Impact
                </span>
              </div>

              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <span className="text-sm text-neutral-700">Story</span>
                <div className="h-2 overflow-hidden rounded-full bg-black/10">
                  <div className="h-full w-[34%] rounded-full bg-neutral-950" />
                </div>
                <span className="text-sm font-semibold text-neutral-950">
                  Low Impact
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Button fullWidth onClick={() => navigate('/influencer/dashboard')}>
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
