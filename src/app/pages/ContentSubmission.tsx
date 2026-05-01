import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, Link2, Loader2, Check } from 'lucide-react';

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
    <div className="flex flex-col min-h-full">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-xs uppercase tracking-widest text-white/40">Submit</div>
          <div className="text-white">Acme Co. · Reel</div>
        </div>
      </div>

      <div className="px-5 space-y-4 flex-1">
        <button
          onClick={() => setHasFile((v) => !v)}
          className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
            hasFile ? 'bg-white/[0.06] border-white/30' : 'bg-white/[0.02] border-white/10'
          }`}
        >
          {hasFile ? (
            <>
              <Check className="w-6 h-6 text-white" />
              <span className="text-white text-sm">reel_final_v2.mp4</span>
              <span className="text-[11px] text-white/40">Tap to replace</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-white/60" />
              <span className="text-white/70 text-sm">Upload screenshot or video</span>
              <span className="text-[11px] text-white/40">PNG · JPG · MP4 up to 200MB</span>
            </>
          )}
        </button>

        <div>
          <label className="text-xs uppercase tracking-widest text-white/40">Or paste link</label>
          <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-white/30">
            <Link2 className="w-4 h-4 text-white/40" />
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="instagram.com/p/..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-widest text-white/40">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            placeholder="Write the caption you'll publish…"
            className="mt-2 w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-white/30 text-sm resize-none"
          />
        </div>
        <div className="h-28" />
      </div>

      <div className="sticky bottom-0 backdrop-blur-xl bg-black/70 border-t border-white/10 px-5 py-4">
        <button
          onClick={submit}
          disabled={submitting || done || !caption || (!link && !hasFile)}
          className="w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
        >
          {done ? <><Check className="w-4 h-4" /> Submitted</> : submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : 'Mark as Completed'}
        </button>
      </div>
    </div>
  );
}
