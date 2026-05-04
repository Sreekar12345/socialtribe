import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { nicheOptions } from '../../data/mockData';

export function InfluencerSetupPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useAuth();
  const [handle, setHandle] = useState(profile.instagramHandle ?? '');
  const [niche, setNiche] = useState(profile.niche ?? 'Fitness');

  const save = () => {
    if (!handle.trim()) return;
    setProfile((current) => ({
      ...current,
      instagramHandle: handle.trim(),
      niche,
      verificationStatus: 'idle',
      verificationError: undefined,
      verificationResult: undefined,
    }));
    navigate('/influencer/verify');
  };

  return (
    <div className="fin-page">
      <TopBar
        left={<BackButton onClick={() => navigate('/auth')} />}
        title="Creator setup"
        subtitle="Add your Instagram handle and category before verification."
      />

      <div className="space-y-4 rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <Input
          label="Instagram handle"
          value={handle}
          onChange={(event) => setHandle(event.target.value)}
          placeholder="@yourhandle"
        />
        <div className="space-y-2">
          <label className="fin-eyebrow">Category</label>
          <div className="flex flex-wrap gap-2">
            {nicheOptions
              .filter((option) => option !== 'All')
              .map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setNiche(option)}
                  className={`rounded-full px-3 py-2 text-sm ${
                    niche === option
                      ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                      : 'border border-white/10 bg-neutral-950 text-zinc-300'
                  }`}
                >
                  {option}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="fin-panel-lilac">
        <div className="fin-eyebrow">Verification flow</div>
        <div className="mt-2 text-sm leading-6 text-zinc-300">
          SocialTribe will simulate profile verification, process your performance
          data, and generate a final score dashboard.
        </div>
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={save} disabled={!handle.trim()}>
          Continue to verification
        </Button>
      </div>
    </div>
  );
}
