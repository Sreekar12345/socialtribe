import { useNavigate } from 'react-router';
import { Card } from './Card';

interface CampaignCardData {
  id: string;
  title: string;
  brandName: string;
  contentType: string;
  status: string;
}

interface CampaignCardProps {
  data: CampaignCardData;
  className?: string;
}

export function CampaignCard({ data, className = 'p-5' }: CampaignCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/influencer/work/${data.id}`)}
      className={`${className} cursor-pointer transition active:scale-95`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-950">
              {data.title}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">{data.brandName}</p>
          </div>
          <span className="rounded-full bg-[#eef5d8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700">
            {data.status}
          </span>
        </div>

        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Content Type
          </p>
          <p className="mt-2 text-sm font-semibold text-neutral-950">
            {data.contentType}
          </p>
        </div>
      </div>
    </Card>
  );
}
