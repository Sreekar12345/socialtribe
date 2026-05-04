import { Bell, BriefcaseBusiness, ChevronRight, CircleUserRound, MessageSquare, Sparkles, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router';
import { SectionHeader } from '../components/FintechPrimitives';
import { useAuth } from '../context/AuthContext';
import { useCampaign } from '../context/CampaignContext';

export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, role } = useAuth();
  const { selected } = useCampaign();

  const displayName = profile.brandName || 'SocialTribe Account';
  const roleLabel = role === 'influencer' ? 'Creator' : 'Brand';

  const shortcuts = [
    { label: 'Inbox', detail: 'Review creator conversations', icon: MessageSquare, to: '/inbox' },
    { label: 'Wallet', detail: 'Top up and review holds', icon: Wallet, to: '/wallet' },
    { label: 'Campaign setup', detail: 'Start a new brief', icon: BriefcaseBusiness, to: '/budget' },
  ];

  const settings = [
    { label: 'Notifications', detail: 'Push, email, and campaign alerts', icon: Bell, to: '/inbox' },
    { label: 'Verification', detail: 'Connect Instagram and profile proof', icon: Sparkles, to: '/role' },
    { label: 'Creator workspace', detail: 'Open the creator-side app', icon: CircleUserRound, to: '/influencer/home' },
  ];

  return (
    <div className="space-y-6">
      <div className="fin-card">
        <div className="flex items-center gap-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)] text-lg font-semibold text-[var(--accent-foreground)]">
            {displayName
              .split(' ')
              .map((part) => part.charAt(0))
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="fin-eyebrow">Profile</div>
            <div className="mt-2 truncate text-xl font-semibold text-white">{displayName}</div>
            <div className="mt-1 text-sm text-zinc-400">{roleLabel} account</div>
          </div>
          <button type="button" onClick={() => navigate('/role')} className="fin-button-secondary">
            Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ProfileStat label="Saved" value={`${selected.length}`} />
        <ProfileStat label="Live" value="3" />
        <ProfileStat label="Response" value="<2h" />
      </div>

      <section>
        <SectionHeader title="Quick access" />
        <div className="space-y-3">
          {shortcuts.map((item) => (
            <ActionRow key={item.label} label={item.label} detail={item.detail} to={item.to} icon={item.icon} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Settings and tools" />
        <div className="space-y-3">
          {settings.map((item) => (
            <ActionRow key={item.label} label={item.label} detail={item.detail} to={item.to} icon={item.icon} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="fin-card">
      <div className="text-sm font-medium text-white">{value}</div>
      <div className="mt-1 text-xs text-zinc-400">{label}</div>
    </div>
  );
}

function ActionRow({
  label,
  detail,
  to,
  icon: Icon,
}: {
  label: string;
  detail: string;
  to: string;
  icon: typeof Bell;
}) {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate(to)} className="app-list-button">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-sm font-medium text-white">{label}</div>
          <div className="mt-1 text-xs text-zinc-400">{detail}</div>
        </div>
        <ChevronRight className="h-4 w-4 text-zinc-500" />
      </div>
    </button>
  );
}
