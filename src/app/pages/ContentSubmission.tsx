import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link2, Loader2, Check, Upload } from 'lucide-react';
import { BackButton, ScreenHeader } from '../components/FintechPrimitives';

export function ContentSubmission() {
  const nav = useNavigate();
  const [link, setLink] = useState('');
  const [caption, setCaption] = useState('');
  const [hasFile, setHasFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!caption || (!link && !hasFile)) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      setTimeout(() => nav('/influencer/home'), 900);
    }, 800);
  };

  return (
    <div className="fin-page">
      <BackButton onClick={() => nav(-1)} />
      <ScreenHeader
        eyebrow="Submission"
        title="Deliver campaign content."
        subtitle="Upload the asset or paste the live link, then include the exact caption that will publish."
      />

      <button onClick={() => setHasFile((value) => !value)} className={`fin-upload mt-2 ${hasFile ? 'fin-upload-active' : ''}`}>
        {hasFile ? (
          <>
            <Check className="h-6 w-6 text-black" />
            <span className="text-sm text-black">reel_final_v2.mp4</span>
            <span className="text-[11px] text-black/45">Tap to replace</span>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-black/60" />
            <span className="text-sm text-black/75">Upload screenshot or video</span>
            <span className="text-[11px] text-black/45">PNG · JPG · MP4 up to 200MB</span>
          </>
        )}
      </button>

      <div className="fin-panel-cream mt-5">
        <label className="fin-eyebrow">Or paste link</label>
        <div className="fin-input-group">
          <Link2 className="h-4 w-4 text-black/40" />
          <input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="instagram.com/p/..."
            className="flex-1 bg-transparent text-sm text-black placeholder:text-black/35 outline-none"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="fin-eyebrow">Caption</label>
        <textarea
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          rows={4}
          placeholder="Write the caption you'll publish..."
          className="fin-input mt-2 resize-none"
        />
      </div>

      <div className="fin-sticky-actions -mx-5 mt-8">
        <button
          onClick={submit}
          disabled={submitting || done || !caption || (!link && !hasFile)}
          className="fin-button-primary w-full"
        >
          {done ? (
            <>
              <Check className="h-4 w-4" /> Submitted
            </>
          ) : submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            'Mark as completed'
          )}
        </button>
      </div>
    </div>
  );
}
