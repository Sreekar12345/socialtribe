import { Bell, CreditCard, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { useCampaign } from '../../context/CampaignContext';
import { inr } from '../../utils/money';

export function BrandProfilePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { walletBalance } = useCampaign();

  return (
    <div className="space-y-4">
      <TopBar title="Profile" subtitle="Brand info, wallet, and settings." />

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="text-base font-semibold text-white">{profile.brandName || 'Brand account'}</div>
        <div className="mt-1 text-sm text-zinc-400">{profile.industry || 'Industry not set'}</div>
      </div>

      <button type="button" onClick={() => navigate('/brand/checkout')} className="w-full rounded-[24px] border border-white/10 bg-gray-800 p-4 text-left text-white">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Wallet</div>
            <div className="mt-1 text-xs text-zinc-400">{inr(walletBalance)}</div>
          </div>
        </div>
      </button>

      <button type="button" onClick={() => navigate('/brand/chat')} className="w-full rounded-[24px] border border-white/10 bg-gray-800 p-4 text-left text-white">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium">Notifications</div>
            <div className="mt-1 text-xs text-zinc-400">Campaign, creator, and payment updates</div>
          </div>
        </div>
      </button>

      <div className="w-full rounded-[24px] border border-white/10 bg-gray-800 p-4 text-left text-white">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
            <Settings2 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium">Settings</div>
            <div className="mt-1 text-xs text-zinc-400">Account preferences and security</div>
          </div>
        </div>
      </div>
    </div>
  );
}
