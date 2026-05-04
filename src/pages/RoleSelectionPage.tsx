import { Building2, Camera } from 'lucide-react';
import { useNavigate } from 'react-router';
import { RoleCard } from '../components/RoleCard';
import { usePageTitle } from '../hooks/usePageTitle';

export function RoleSelectionPage() {
  usePageTitle('Role selection');

  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
          Who are you?
        </h1>

        <div className="space-y-4">
          <RoleCard
            title="Brand"
            icon={Building2}
            onSelect={() => navigate('/signup/brand')}
          />
          <RoleCard
            title="Influencer"
            icon={Camera}
            onSelect={() => navigate('/signup/influencer')}
          />
        </div>
      </div>
    </div>
  );
}
