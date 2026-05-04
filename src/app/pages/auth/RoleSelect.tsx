import { BriefcaseBusiness, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { TopBar } from '../../components/TopBar';
import { useAuth, type Role } from '../../context/AuthContext';

export function RoleSelect() {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  const chooseRole = (role: Role) => {
    setRole(role);
    navigate('/auth');
  };

  return (
    <div className="fin-page">
      <TopBar title="Choose your role" subtitle="Start as a brand or an influencer." />

      <div className="space-y-3">
        <RoleCard
          icon={BriefcaseBusiness}
          title="Brand"
          detail="Create campaigns, select creators, and manage payments."
          onClick={() => chooseRole('brand')}
        />
        <RoleCard
          icon={Sparkles}
          title="Influencer"
          detail="Review offers, deliver content, and track payouts."
          onClick={() => chooseRole('influencer')}
        />
      </div>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  detail,
  onClick,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-white">{title}</div>
          <div className="mt-2 text-sm leading-6 text-zinc-400">{detail}</div>
        </div>
      </div>
      <div className="mt-4">
        <Button fullWidth onClick={onClick}>
          Continue as {title}
        </Button>
      </div>
    </div>
  );
}
