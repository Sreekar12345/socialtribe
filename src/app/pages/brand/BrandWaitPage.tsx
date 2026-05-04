import { Clock3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/Button';

export function BrandWaitPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="fin-page justify-center">
      <div className="rounded-[28px] border border-white/10 bg-gray-800 p-6 text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-lime-200">
          <Clock3 className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-white">Waiting for creator approval</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">Estimated time: 1-2 hours</p>
        {id ? <div className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-500">{id}</div> : null}
      </div>

      <div className="mt-6 space-y-3">
        <Button fullWidth onClick={() => navigate('/brand/campaigns')}>
          Go to campaigns
        </Button>
        <Button variant="secondary" fullWidth onClick={() => navigate('/brand/campaign')}>
          Edit
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate('/brand/home')}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
