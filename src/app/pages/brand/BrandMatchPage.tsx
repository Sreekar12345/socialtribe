import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { CreatorCard } from '../../components/CreatorCard';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { useCampaign } from '../../context/CampaignContext';
import { influencers } from '../../data/influencers';
import { getCreatorFitLabel } from '../../utils/creatorFit';
import { aiRecommend, getNicheFilterFromIndustry, inr } from '../../utils/money';
import { calculatePrice } from '../../utils/pricing';

export function BrandMatchPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { budget, budgetLabel, budgetMax, budgetMin, campaign, selected, toggle } =
    useCampaign();

  const niche = getNicheFilterFromIndustry(profile.industry);
  const { picked } = useMemo(
    () => aiRecommend(influencers, { min: budgetMin, max: budgetMax }, niche),
    [budgetMax, budgetMin, niche],
  );
  const creatorFitBudget = budgetMax ?? budget;

  const selectedTotal = influencers
    .filter((creator) => selected.includes(creator.id))
    .reduce((sum, creator) => sum + calculatePrice(creator.price, campaign.deliverables), 0);

  return (
    <div className="fin-page">
      <TopBar left={<BackButton onClick={() => navigate('/brand/campaign')} />} title="AI matches" subtitle="Recommended creators for your campaign." />

      <div className="rounded-[24px] border border-lime-200/20 bg-lime-200/10 p-4">
        <div className="fin-eyebrow text-lime-200">Budget usage</div>
        <div className="mt-2 text-lg font-semibold text-white">
          Using {inr(selectedTotal)} of {budgetLabel}
        </div>
        <div className="mt-1 text-sm text-zinc-300">{selected.length} creators selected</div>
      </div>

      <div className="space-y-4">
        {picked.map((creator) => (
          <CreatorCard
            key={creator.id}
            image={creator.image}
            name={creator.name}
            handle={creator.handle}
            followersLabel={creator.followersLabel}
            engagement={creator.engagement}
            niche={creator.niche}
            fitLabel={getCreatorFitLabel(creator, creatorFitBudget)}
            verified={creator.verified}
            primaryLabel={selected.includes(creator.id) ? 'Selected' : 'Select'}
            onPrimaryClick={() => toggle(creator.id)}
          />
        ))}
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate('/brand/select')} disabled={selected.length === 0}>
          Proceed
        </Button>
      </div>
    </div>
  );
}
