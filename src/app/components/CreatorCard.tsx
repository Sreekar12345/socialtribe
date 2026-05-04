import { BadgeCheck, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Button } from './Button';

interface CreatorCardProps {
  image: string;
  name: string;
  handle?: string;
  followersLabel: string;
  engagement: number;
  niche: string;
  fitLabel?: string;
  verified?: boolean;
  primaryLabel: string;
  onPrimaryClick: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
}

export function CreatorCard({
  image,
  name,
  handle,
  followersLabel,
  engagement,
  niche,
  fitLabel,
  verified,
  primaryLabel,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
}: CreatorCardProps) {
  return (
    <article className="rounded-[24px] border border-white/10 bg-gray-800 p-3 text-white">
      <img src={image} alt={name} className="h-44 w-full rounded-[18px] object-cover" />
      <div className="mt-3 flex items-start gap-3">
        <img src={image} alt="" className="h-10 w-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-medium">{name}</span>
            {verified ? <BadgeCheck className="h-4 w-4 text-lime-200" /> : null}
          </div>
          {handle ? <div className="mt-1 truncate text-xs text-zinc-400">{handle}</div> : null}
        </div>
        {fitLabel ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-lime-200 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-black">
            <Sparkles className="h-3 w-3" />
            {fitLabel}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="fin-chip">
          <Users className="h-3.5 w-3.5" /> {followersLabel}
        </span>
        <span className="fin-chip">
          <TrendingUp className="h-3.5 w-3.5" /> {engagement}% ER
        </span>
        <span className="fin-chip">{niche}</span>
      </div>
      <div className="mt-4 flex gap-2">
        {secondaryLabel && onSecondaryClick ? (
          <Button variant="secondary" fullWidth onClick={onSecondaryClick}>
            {secondaryLabel}
          </Button>
        ) : null}
        <Button fullWidth onClick={onPrimaryClick}>
          {primaryLabel}
        </Button>
      </div>
    </article>
  );
}
