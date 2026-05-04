import { Search, TriangleAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { CreatorCard } from '../../components/CreatorCard';
import { BackButton } from '../../components/FintechPrimitives';
import { Modal } from '../../components/Modal';
import { TopBar } from '../../components/TopBar';
import { useCampaign } from '../../context/CampaignContext';
import { influencers } from '../../data/influencers';
import { followerFilterOptions, nicheOptions } from '../../data/mockData';
import { getCampaignBudgetLimit } from '../../utils/campaignBudget';
import { getCreatorFitLabel, matchesFollowerFilter } from '../../utils/creatorFit';
import { inr } from '../../utils/money';
import { calculatePrice } from '../../utils/pricing';

export function BrandManualSelectionPage() {
  const navigate = useNavigate();
  const { selected, toggle, budget, budgetLabel, budgetMax, setBudget, campaign } =
    useCampaign();
  const [query, setQuery] = useState('');
  const [niche, setNiche] = useState('All');
  const [followerFilter, setFollowerFilter] = useState('All');
  const [showWarning, setShowWarning] = useState(false);

  const filteredCreators = useMemo(() => {
    return influencers.filter((creator) => {
      const matchesQuery =
        query.trim().length === 0 ||
        creator.name.toLowerCase().includes(query.toLowerCase()) ||
        creator.handle.toLowerCase().includes(query.toLowerCase());
      const matchesNiche = niche === 'All' || creator.niche === niche;
      return matchesQuery && matchesNiche && matchesFollowerFilter(creator, followerFilter);
    });
  }, [followerFilter, niche, query]);

  const selectedCreators = influencers.filter((creator) => selected.includes(creator.id));
  const selectedTotal = selectedCreators.reduce((sum, creator) => {
    if (campaign.deliverables.length === 0) return sum + creator.price;
    return sum + calculatePrice(creator.price, campaign.deliverables);
  }, 0);
  const budgetLimit = getCampaignBudgetLimit(budgetMax);
  const overBudget = selectedTotal > budgetLimit;
  const creatorFitBudget = budgetMax ?? budget;

  useEffect(() => {
    if (overBudget) setShowWarning(true);
  }, [overBudget]);

  return (
    <div className="fin-page">
      <TopBar
        left={<BackButton onClick={() => navigate('/brand/match')} />}
        title="Select creators"
        subtitle={`Budget ${budgetLabel} | Using ${inr(selectedTotal)}`}
      />

      <div className="rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950 px-4 py-3">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search creators"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
          />
        </div>
        <div className="mt-3 app-scroll-row">
          {nicheOptions.map((option) => (
            <button key={option} type="button" onClick={() => setNiche(option)} className={`fin-chip ${niche === option ? 'fin-chip-active' : ''}`}>
              {option}
            </button>
          ))}
        </div>
        <div className="mt-3 app-scroll-row">
          {followerFilterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFollowerFilter(option)}
              className={`fin-chip ${followerFilter === option ? 'fin-chip-active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {overBudget ? (
        <div className="rounded-[24px] border border-amber-500/20 bg-amber-500/10 p-4 text-amber-100">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-4 w-4" />
            <div className="flex-1">
              <div className="text-sm font-medium">Budget exceeded</div>
              <div className="mt-1 text-sm text-amber-100/75">Increase the budget or adjust the creator selection to continue.</div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBudget(budget + 5000);
                    setShowWarning(false);
                  }}
                >
                  Increase budget
                </Button>
                <Button variant="ghost" onClick={() => setShowWarning(true)}>
                  Adjust selection
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {filteredCreators.map((creator) => (
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
            primaryLabel={selected.includes(creator.id) ? 'Remove' : 'Select'}
            onPrimaryClick={() => toggle(creator.id)}
          />
        ))}
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={() => navigate('/brand/review')} disabled={selected.length === 0 || overBudget}>
          Continue
        </Button>
      </div>

      <Modal
        open={showWarning}
        onClose={() => setShowWarning(false)}
        title="Adjust selection"
        description="Your selected creators are above the current budget."
        actions={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setBudget(budget + 5000);
                setShowWarning(false);
              }}
            >
              Increase budget
            </Button>
            <Button variant="ghost" fullWidth onClick={() => setShowWarning(false)}>
              Keep editing
            </Button>
          </>
        }
      >
        <div className="text-sm text-zinc-400">
          Current budget: {budgetLabel}. Selected total: {inr(selectedTotal)}.
        </div>
      </Modal>
    </div>
  );
}
