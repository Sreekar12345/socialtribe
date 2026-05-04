import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { checkInstagramExists, validateInstagramHandle } from '../../utils/instagram';
import { BackButton, ScreenHeader } from '../../components/FintechPrimitives';

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
        if (handleError === null) setStatus('checking');
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
    <div className="fin-page">
      <BackButton onClick={() => nav(-1)} />
      <ScreenHeader
        eyebrow="Profile setup"
        title={isInfluencer ? 'Complete your creator profile.' : 'Complete your brand profile.'}
        subtitle={isInfluencer ? 'We use this to validate creator identity, audience fit, and marketplace readiness.' : 'We use this to shape recommendations and spending guidance.'}
      />

      <div className="fin-panel-cream mt-2 space-y-5">
        {isInfluencer ? (
          <>
            <Text label="Instagram Handle" value={handle} onChange={setHandle} placeholder="@username" />
            {status === 'checking' ? <p className="-mt-3 text-xs text-black/50">Checking...</p> : null}
            {status === 'valid' ? <p className="-mt-3 text-xs text-emerald-700">Valid Instagram handle</p> : null}
            {status === 'invalid' && handleError === 'format' ? <p className="-mt-3 text-xs text-rose-700">Invalid handle format</p> : null}
            {status === 'invalid' && handleError === 'not_found' ? <p className="-mt-3 text-xs text-rose-700">Handle does not exist</p> : null}
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
            {errors.followers ? <p className="-mt-3 text-xs text-rose-700">{errors.followers}</p> : null}
          </>
        ) : (
          <>
            <Text label="Brand name" value={brandName} onChange={setBrandName} placeholder="Acme Co." />
            <div>
              <label className="fin-eyebrow">Industry</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {industries.map((entry) => (
                  <button
                    key={entry}
                    onClick={() => setIndustry(entry)}
                    className={`rounded-full border px-3 py-2 text-xs transition-all ${industry === entry ? 'border-black bg-black text-white' : 'border-black/10 bg-white text-black/65'}`}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1" />

      <button disabled={isContinueDisabled} onClick={finish} className="fin-button-primary mt-8 w-full">
        Continue <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="fin-eyebrow">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="fin-input mt-2"
      />
    </div>
  );
}
