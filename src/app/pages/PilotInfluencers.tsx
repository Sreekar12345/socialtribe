import { useMemo, useState } from 'react';
import { ArrowRight, BadgeCheck, MessageSquare, Search, SlidersHorizontal, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router';
import { SectionHeader } from '../components/FintechPrimitives';
import { useCampaign } from '../context/CampaignContext';
import { useAuth } from '../context/AuthContext';
import { categories, influencers } from '../data/influencers';
import { getNicheFilterFromIndustry, inr } from '../utils/money';

const followerOptions = [
  { label: 'Any', min: 0 },
  { label: '25K+', min: 25000 },
  { label: '50K+', min: 50000 },
  { label: '100K+', min: 100000 },
];

export function PilotInfluencers() {
  const navigate = useNavigate();
  const { selected, toggle, budgetLabel } = useCampaign();
  const { profile } = useAuth();
  const [category, setCategory] = useState(getNicheFilterFromIndustry(profile.industry));
  const [query, setQuery] = useState('');
  const [followerIndex, setFollowerIndex] = useState(0);

  const filtered = useMemo(() => {
    return influencers.filter((creator) => {
      const matchesCategory = category === 'All' || creator.niche === category;
      const matchesFollowers = creator.followers >= followerOptions[followerIndex].min;
      const matchesQuery =
        query.trim().length === 0 ||
        creator.name.toLowerCase().includes(query.toLowerCase()) ||
        creator.handle.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesFollowers && matchesQuery;
    });
  }, [category, followerIndex, query]);

  const selectedCreators = influencers.filter((creator) => selected.includes(creator.id));
  const committed = selectedCreators.reduce((sum, creator) => sum + creator.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="fin-eyebrow">Explore</div>
          <h1 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.03em] text-white">Find creators fast</h1>
        </div>
        <button type="button" onClick={() => navigate('/ai-plan')} className="fin-chip">
          AI shortlist
        </button>
      </div>

      <div className="fin-panel-lime">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="fin-eyebrow text-black/60">Campaign budget</div>
            <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-black">{budgetLabel}</div>
            <p className="mt-2 text-sm text-black/65">{selected.length} creators selected - {inr(committed)} committed</p>
          </div>
          <button type="button" onClick={() => navigate('/budget')} className="rounded-full bg-black px-4 py-2 text-sm text-white">
            Tune budget
          </button>
        </div>
      </div>

      <div className="fin-input-group">
        <Search className="h-4 w-4 text-zinc-500" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by creator name or handle"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
        />
      </div>

      <div className="app-scroll-row">
        {categories.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setCategory(entry)}
            className={`fin-chip ${category === entry ? 'fin-chip-active' : ''}`}
          >
            {entry}
          </button>
        ))}
        <button type="button" onClick={() => setFollowerIndex((index) => (index + 1) % followerOptions.length)} className="fin-chip">
          <SlidersHorizontal className="h-3.5 w-3.5" /> {followerOptions[followerIndex].label}
        </button>
      </div>

      <section>
        <SectionHeader title={`${filtered.length} creators`} />
        <div className="space-y-4">
          {filtered.map((creator) => {
            const isSelected = selected.includes(creator.id);

            return (
              <article key={creator.id} className="fin-card">
                <img src={creator.image} alt={creator.name} className="app-media" />
                <div className="mt-4 flex items-center gap-3">
                  <img src={creator.image} alt="" className="app-avatar" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-sm font-medium text-white">{creator.name}</span>
                      {creator.verified ? <BadgeCheck className="h-4 w-4 text-lime-200" /> : null}
                    </div>
                    <div className="mt-1 text-xs text-zinc-400">{creator.handle} - {creator.niche}</div>
                  </div>
                  <span className={`fin-badge ${creator.available ? 'fin-badge-success' : 'fin-badge-warning'}`}>
                    {creator.available ? 'Available' : 'Booked'}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="fin-chip">
                    <Users className="h-3.5 w-3.5" /> {creator.followersLabel}
                  </span>
                  <span className="fin-chip">
                    <TrendingUp className="h-3.5 w-3.5" /> {creator.engagement}% ER
                  </span>
                  <span className="fin-chip">{inr(creator.price)}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => navigate(`/chat/${creator.id}`, { state: { from: '/explore' } })} className="fin-button-secondary flex-1">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>
                  <button type="button" onClick={() => toggle(creator.id)} className={`flex-1 ${isSelected ? 'fin-button-primary' : 'fin-button-secondary'}`}>
                    {isSelected ? 'Selected' : 'Collaborate'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 ? <div className="fin-empty-state mt-4">No creators match this filter set yet.</div> : null}
      </section>

      {selected.length > 0 ? (
        <div className="fin-sticky-actions -mx-4">
          <button type="button" onClick={() => navigate('/campaign')} className="fin-button-primary w-full">
            Continue with {selected.length} creators <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
