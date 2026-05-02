import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { checkInstagramExists, validateInstagramHandle } from '../../utils/instagram';

type HandleStatus = 'idle' | 'checking' | 'valid' | 'invalid';
type HandleValidationError = 'format' | 'not_found' | null;

export function ProfileSetup() {
  const nav = useNavigate();
  const { role, setProfile } = useAuth();

  const isInfluencer = role === 'influencer';
  const dest = isInfluencer ? '/influencer/home' : '/budget';

  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [handle, setHandle] = useState('');
  const [status, setStatus] = useState<HandleStatus>('idle');
  const [handleError, setHandleError] = useState<HandleValidationError>(null);
  const [followers, setFollowers] = useState('');
  const [errors, setErrors] = useState<{ followers?: string }>({});

  const industries = ['DTC', 'SaaS', 'Fashion', 'Food', 'Beauty', 'Other'];
  const isContinueDisabled = isInfluencer && status !== 'valid';

  useEffect(() => {
    if (!isInfluencer) return;

    if (!handle) {
      setStatus('idle');
      setHandleError(null);
      return;
    }

    if (!validateInstagramHandle(handle)) {
      setStatus('invalid');
      setHandleError('format');
      return;
    }

    let cancelled = false;
    setStatus('checking');
    setHandleError(null);

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        const exists = await checkInstagramExists(handle);
        if (cancelled) return;

        if (exists) {
          setStatus('valid');
          setHandleError(null);
          return;
        }

        setStatus('invalid');
        setHandleError('not_found');
      })();
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [handle, isInfluencer]);

  const finish = () => {
    if (isInfluencer) {
      if (!validateInstagramHandle(handle)) {
        setStatus('invalid');
        setHandleError('format');
        return;
      }

      if (status !== 'valid') {
        if (handleError === null) {
          setStatus('checking');
        }
        return;
      }

      const nextErrors: { followers?: string } = {};

      if (!followers.trim()) {
        nextErrors.followers = 'Followers is required.';
      } else if (!/^\d+$/.test(followers) || Number(followers) <= 0) {
        nextErrors.followers = 'Followers must be a number greater than 0.';
      }

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setErrors({});
      setProfile(({ instagramHandle: handle, followers } as unknown) as Parameters<typeof setProfile>[0]);
      nav(dest);
      return;
    }

    setProfile({ brandName, industry });
    nav(dest);
  };

  return (
    <div className="flex flex-col min-h-full px-6 pt-14 pb-8">
      <button onClick={() => nav(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="mt-12">
        <div className="text-xs uppercase tracking-widest text-white/40">One last step</div>
        <h1 className="mt-2 text-white text-3xl tracking-tight">
          {isInfluencer ? 'Your creator profile' : 'Your brand'}
        </h1>
      </div>

      <div className="mt-8 space-y-5">
        {isInfluencer ? (
          <>
            <Text
              label="Instagram Handle"
              value={handle}
              onChange={(value) => {
                setHandle(value);
              }}
              placeholder="@username"
            />
            {status === 'checking' ? <p className="-mt-3 text-xs text-white/50">Checking...</p> : null}
            {status === 'valid' ? <p className="-mt-3 text-xs text-emerald-300">Valid Instagram handle</p> : null}
            {status === 'invalid' && handleError === 'format' ? <p className="-mt-3 text-xs text-red-300">Invalid handle format</p> : null}
            {status === 'invalid' && handleError === 'not_found' ? <p className="-mt-3 text-xs text-red-300">Handle does not exist</p> : null}
            <Text
              label="Followers"
              value={followers}
              onChange={(value) => {
                setFollowers(value);
                setErrors((current) => ({ ...current, followers: undefined }));
              }}
              placeholder="48000"
              type="number"
            />
            {errors.followers ? <p className="-mt-3 text-xs text-red-300">{errors.followers}</p> : null}
          </>
        ) : (
          <>
            <Text label="Brand name" value={brandName} onChange={setBrandName} placeholder="Acme Co." />
            <div>
              <label className="text-xs uppercase tracking-widest text-white/40">Industry</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {industries.map((c) => (
                  <button
                    key={c}
                    onClick={() => setIndustry(c)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                      industry === c ? 'bg-white text-black border-white' : 'bg-white/[0.03] text-white/70 border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1" />

      <button
        disabled={isContinueDisabled}
        onClick={finish}
        className="mt-8 w-full py-3.5 rounded-2xl bg-white text-black flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Continue <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function Text({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-white/40">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-white/30 text-sm"
      />
    </div>
  );
}
