import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { simulateVerificationCheck } from '../../utils/verification';

export function InfluencerVerificationPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useAuth();

  useEffect(() => {
    if (!profile.instagramHandle) {
      navigate('/influencer/setup', { replace: true });
      return;
    }

    if (profile.verificationStatus === 'processing') {
      navigate('/influencer/processing', { replace: true });
      return;
    }

    if (profile.verificationStatus === 'ready') {
      navigate('/influencer/home', { replace: true });
      return;
    }

    let active = true;

    setProfile((current) => ({
      ...current,
      verificationStatus: 'verifying',
      verificationError: undefined,
      verificationResult: undefined,
    }));

    simulateVerificationCheck(profile.instagramHandle).then((outcome) => {
      if (!active) return;

      if (!outcome.valid) {
        setProfile((current) => ({
          ...current,
          verificationStatus: 'invalid',
          verificationError: outcome.reason,
          verificationResult: undefined,
        }));
        return;
      }

      setProfile((current) => ({
        ...current,
        verificationStatus: 'processing',
        verificationError: undefined,
      }));
      navigate('/influencer/processing', { replace: true });
    });

    return () => {
      active = false;
    };
  }, [navigate, profile.instagramHandle, profile.verificationStatus, setProfile]);

  return (
    <div className="fin-page justify-center">
      <TopBar
        left={<BackButton onClick={() => navigate('/influencer/setup')} />}
        title="Profile verification"
        subtitle="We are checking your Instagram profile for public activity."
      />

      {profile.verificationStatus === 'invalid' ? (
        <div className="space-y-4 rounded-[28px] border border-rose-400/20 bg-rose-500/10 p-6 text-center text-white">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-rose-200">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <div className="text-xl font-semibold">Verification needs attention</div>
            <p className="text-sm leading-6 text-rose-100/80">
              {profile.verificationError}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Button
              fullWidth
              onClick={() =>
                setProfile((current) => ({
                  ...current,
                  verificationStatus: 'idle',
                  verificationError: undefined,
                  verificationResult: undefined,
                }))
              }
            >
              <RotateCcw className="h-4 w-4" /> Retry
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/influencer/setup')}
            >
              Edit handle
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-[28px] border border-white/10 bg-gray-800 p-6 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <div className="mt-5 text-xl font-semibold text-white">
              Verifying your Instagram profile...
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              SocialTribe is checking public activity for {profile.instagramHandle}.
            </p>
          </div>

          <div className="fin-panel-lime">
            <div className="fin-eyebrow text-black/60">Design note</div>
            <div className="mt-2 text-sm leading-6 text-black/75">
              This step uses the editorial block language from DESIGN.md while
              staying inside the existing dark app shell.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
