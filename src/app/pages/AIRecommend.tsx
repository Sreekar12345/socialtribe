import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Loader2, Sparkles, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BackButton, ScreenHeader } from '../components/FintechPrimitives';
import { useCampaign } from '../context/CampaignContext';
import { useAuth } from '../context/AuthContext';
import { influencers } from '../data/influencers';
import { aiRecommend, getNicheFilterFromIndustry, inr } from '../utils/money';

export function AIRecommend() {
  const navigate = useNavigate();
  const { budgetLabel, budgetMin, budgetMax, setSelected } = useCampaign();
  const { profile } = useAuth();
  const [thinking, setThinking] = useState(true);

  const niche = getNicheFilterFromIndustry(profile.industry);
  const { picked, spent } = useMemo(
    () => aiRecommend(influencers, { min: budgetMin, max: budgetMax }, niche),
    [budgetMax, budgetMin, niche],
  );

  useEffect(() => {
    const timer = setTimeout(() => setThinking(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const proceed = () => {
    setSelected(picked.map((item) => item.id));
    navigate('/campaign');
  };

  const customize = () => {
    setSelected(picked.map((item) => item.id));
    navigate('/explore');
  };

  if (thinking) {
    return (
      <div className="fin-page items-center justify-center">
        <div className="fin-card w-full max-w-sm text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-lime-200">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-zinc-300">
            <Loader2 className="h-4 w-4 animate-spin" /> Ranking creators for your budget
          </div>
          <div className="mt-3 text-xs text-zinc-500">Matching by niche, engagement, and price fit</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fin-page">
      <BackButton onClick={() => navigate(-1)} />
      <ScreenHeader
        eyebrow="AI shortlist"
        title={`Best-fit creators for ${budgetLabel}`}
        subtitle="A quick shortlist ranked by engagement, price, and audience fit."
      />

      <div className="fin-panel-lime">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="fin-eyebrow text-black/60">Recommended spend</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-black">{inr(spent)}</div>
          </div>
          <span className="rounded-full bg-black px-3 py-1.5 text-xs text-white">{picked.length} creators</span>
        </div>
      </div>

      <div className="space-y-3">
        {picked.map((creator) => (
          <div key={creator.id} className="fin-card">
            <div className="flex items-center gap-3">
              <img src={creator.image} alt={creator.name} className="h-12 w-12 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">{creator.name}</div>
                <div className="mt-1 text-xs text-zinc-400">{creator.handle} - {creator.niche}</div>
              </div>
              <span className="text-sm font-medium text-lime-200">{inr(creator.price)}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="fin-chip">
                <Users className="h-3.5 w-3.5" /> {creator.followersLabel}
              </span>
              <span className="fin-chip">
                <TrendingUp className="h-3.5 w-3.5" /> {creator.engagement}% ER
              </span>
            </div>
          </div>
        ))}

        {picked.length === 0 ? <div className="fin-empty-state">No creators fit this budget. Increase the amount and retry.</div> : null}
      </div>

      <div className="fin-sticky-actions -mx-4 space-y-3">
        <button type="button" onClick={proceed} disabled={picked.length === 0} className="fin-button-primary w-full">
          Use this shortlist <ArrowRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={customize} className="fin-button-secondary w-full">
          Customize manually
        </button>
      </div>
    </div>
  );
}
