import { Check, Link2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useInfluencerWork } from '../context/InfluencerWorkContext';
import { usePageTitle } from '../hooks/usePageTitle';

export function InfluencerSubmitPage() {
  usePageTitle('Submit Content');

  const navigate = useNavigate();
  const { campaignId = '' } = useParams();
  const { findCampaignById, submitCampaignContent } = useInfluencerWork();
  const campaign = findCampaignById(campaignId);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | undefined>();
  const [link, setLink] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!campaign) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
          Submit Content
        </h1>
        <Card className="p-6 text-center">
          <p className="text-base font-semibold text-neutral-950">
            Campaign not found
          </p>
        </Card>
      </div>
    );
  }

  const hasSubmissionSource = Boolean(uploadedFile || link.trim());

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleSubmit() {
    if (!hasSubmissionSource) {
      setError('Upload a file or paste an Instagram link to continue.');
      return;
    }

    setError('');
    setSubmitting(true);

    window.setTimeout(() => {
      submitCampaignContent({
        campaignId: campaign.id,
        mediaUrl: link.trim() || undefined,
        uploadedFile,
        caption: caption.trim(),
      });
      navigate('/influencer/campaigns');
    }, 700);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
          Submit Content
        </h1>
        <p className="text-sm leading-6 text-neutral-600">
          {campaign.brandName} {'\u00B7'} {campaign.contentType}
        </p>
      </div>

      <Card className="p-6">
        <button
          type="button"
          onClick={openFilePicker}
          className={`flex min-h-[220px] w-full flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed p-4 text-center transition ${
            uploadedFile
              ? 'border-[#dceeb1] bg-[#eef5d8] text-neutral-950'
              : 'border-black/10 bg-[#f7f7f5] text-neutral-700'
          }`}
        >
          {uploadedFile ? (
            <>
              <Check className="h-6 w-6" />
              <span className="text-sm font-medium">{uploadedFile.name}</span>
              <span className="text-[11px] text-neutral-500">
                Tap to replace
              </span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-neutral-500" />
              <span className="text-sm font-medium">
                Upload image or video
              </span>
              <span className="text-[11px] text-neutral-500">
                PNG, JPG, MP4 up to 200MB
              </span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setUploadedFile(file);
            if (file) {
              setLink('');
              setError('');
            }
          }}
        />
      </Card>

      <Card className="p-6">
        <label className="flex flex-col gap-2">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Or paste Instagram link
          </span>
          <div className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-white px-4">
            <Link2 className="h-4 w-4 text-neutral-500" />
            <input
              value={link}
              onChange={(event) => {
                setLink(event.target.value);
                if (event.target.value.trim()) {
                  setUploadedFile(undefined);
                  setError('');
                }
              }}
              placeholder="instagram.com/p/..."
              className="flex-1 bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
            />
          </div>
        </label>
      </Card>

      <Card className="p-6">
        <label className="flex flex-col gap-2">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Caption
          </span>
          <textarea
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            rows={4}
            placeholder="Write the caption you plan to publish..."
            className="resize-none rounded-[24px] border border-black/10 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-black/30"
          />
        </label>
      </Card>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <Button
        fullWidth
        onClick={handleSubmit}
        disabled={submitting}
        loading={submitting}
      >
        Submit Content
      </Button>
    </div>
  );
}
