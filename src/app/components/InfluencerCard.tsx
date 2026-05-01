import { TrendingUp, Users } from 'lucide-react';
import { Card } from './Card';

interface InfluencerCardProps {
  id: string;
  name: string;
  niche: string;
  followers: string;
  engagement: string;
  price: string;
  image: string;
  onClick?: () => void;
}

export function InfluencerCard({
  name,
  niche,
  followers,
  engagement,
  price,
  image,
  onClick
}: InfluencerCardProps) {
  return (
    <Card glass className="cursor-pointer hover:bg-white/10 transition-all" onClick={onClick}>
      <div className="flex gap-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-foreground mb-1">{name}</h3>
          <div className="inline-block px-2 py-0.5 bg-white/10 rounded text-xs text-muted-foreground mb-2">
            {niche}
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {followers}
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {engagement}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-foreground">{price}</div>
          <div className="text-xs text-muted-foreground">per post</div>
        </div>
      </div>
    </Card>
  );
}
