import { Check, Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { Input } from '../../components/Input';
import { TopBar } from '../../components/TopBar';

export function InfluencerExecutionPage() {
  const navigate = useNavigate();
  const { id = 'offer-1' } = useParams();
  const [link, setLink] = useState('');
  const [hasUpload, setHasUpload] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = () => {
    if (!link.trim() && !hasUpload) return;
    setSubmitting(true);
    window.setTimeout(() => navigate(`/influencer/payment/${id}`), 700);
  };

  return (
    <div className="fin-page">
      <TopBar left={<BackButton onClick={() => navigate(`/influencer/campaign/${id}`)} />} title="Execution" subtitle="Upload content and mark the job complete." />

      <button
        type="button"
        onClick={() => setHasUpload((value) => !value)}
        className={`flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed p-4 text-center ${hasUpload ? 'border-lime-200/40 bg-lime-200/10 text-white' : 'border-white/10 bg-gray-800 text-zinc-300'}`}
      >
        {hasUpload ? (
          <>
            <Check className="h-6 w-6 text-lime-200" />
            <span className="text-sm">content_final.mp4 uploaded</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6" />
            <span className="text-sm">Upload content</span>
          </>
        )}
      </button>

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <Input label="Live link" value={link} onChange={(event) => setLink(event.target.value)} placeholder="instagram.com/p/..." />
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={submit} disabled={(!link.trim() && !hasUpload) || submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting
            </>
          ) : (
            'Mark as complete'
          )}
        </Button>
      </div>
    </div>
  );
}
