import { Settings2, ShieldCheck, UserRound } from 'lucide-react';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';

export function InfluencerProfilePage() {
  const { profile } = useAuth();

  return (
    <div className="space-y-4">
      <TopBar title="Profile" subtitle="Creator info, verification, and settings." />

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-white">
              {profile.instagramHandle || '@creator'}
            </div>
            <div className="mt-1 text-xs text-zinc-400">
              {profile.niche || 'Category not set'}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium">Verification status</div>
            <div className="mt-1 text-xs text-zinc-400">
              {profile.verificationStatus === 'ready'
                ? `Score ${profile.verificationResult?.score ?? '--'}`
                : 'Verification not completed'}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
            <Settings2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium">Settings</div>
            <div className="mt-1 text-xs text-zinc-400">
              Account, notification, and privacy preferences
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
