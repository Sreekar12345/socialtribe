import { Button } from './Button';
import { cn } from './ui/utils';

interface CampaignCardProps {
  name: string;
  status: 'pending' | 'active' | 'completed';
  creators: string[];
  detail: string;
  onView: () => void;
}

export function CampaignCard({ name, status, creators, detail, onView }: CampaignCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="mt-1 text-xs text-zinc-400">{detail}</div>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em]',
            status === 'pending' && 'bg-amber-500/15 text-amber-200',
            status === 'active' && 'bg-emerald-500/15 text-emerald-200',
            status === 'completed' && 'bg-zinc-700 text-zinc-200',
          )}
        >
          {status}
        </span>
      </div>
      <div className="mt-4 text-sm text-zinc-300">{creators.join(', ')}</div>
      <div className="mt-4">
        <Button fullWidth onClick={onView}>
          View
        </Button>
      </div>
    </div>
  );
}
