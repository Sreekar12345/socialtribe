import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { industryOptions } from '../../data/mockData';

export function BrandSetupPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useAuth();
  const [brandName, setBrandName] = useState(profile.brandName ?? '');
  const [industry, setIndustry] = useState(profile.industry ?? industryOptions[0]);

  const submit = () => {
    if (!brandName.trim()) return;
    setProfile({ ...profile, brandName: brandName.trim(), industry });
    navigate('/brand/budget');
  };

  return (
    <div className="fin-page">
      <TopBar left={<BackButton onClick={() => navigate('/auth')} />} title="Brand setup" subtitle="Add your brand name and industry." />

      <div className="space-y-4 rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <Input label="Brand name" value={brandName} onChange={(event) => setBrandName(event.target.value)} placeholder="Acme Labs" />
        <div className="space-y-2">
          <label className="fin-eyebrow">Industry</label>
          <div className="flex flex-wrap gap-2">
            {industryOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setIndustry(option)}
                className={`rounded-full px-3 py-2 text-sm ${industry === option ? 'bg-[var(--accent)] text-[var(--accent-foreground)]' : 'border border-white/10 bg-neutral-950 text-zinc-300'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={submit} disabled={!brandName.trim()}>
          Continue
        </Button>
      </div>
    </div>
  );
}
