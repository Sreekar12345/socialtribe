import { Button } from './Button';

interface OfferCardProps {
  brandName: string;
  deliverables: string;
  deadline: string;
  onAccept: () => void;
  onReject: () => void;
}

export function OfferCard({
  brandName,
  deliverables,
  deadline,
  onAccept,
  onReject,
}: OfferCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4 text-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium">{brandName}</div>
          <div className="mt-1 text-xs text-zinc-400">{deliverables}</div>
        </div>
        <span className="fin-badge fin-badge-info">New request</span>
      </div>
      <div className="mt-3 text-xs text-zinc-500">Deadline: {deadline}</div>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" fullWidth onClick={onReject}>
          Reject
        </Button>
        <Button fullWidth onClick={onAccept}>
          Review
        </Button>
      </div>
    </div>
  );
}
