import { Bell, Plus, UserRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { CreatorCard } from '../../components/CreatorCard';
import { TopBar } from '../../components/TopBar';
import { influencers } from '../../data/influencers';
import { followerFilterOptions, nicheOptions } from '../../data/mockData';
import { getCreatorFitLabel, matchesFollowerFilter } from '../../utils/creatorFit';

export function BrandHomePage() {
  const navigate = useNavigate();
  const [niche, setNiche] = useState('All');
  const [followers, setFollowers] = useState('All');

  const feed = useMemo(() => {
    return influencers.filter((creator) => {
      const nicheMatch = niche === 'All' || creator.niche === niche;
      return nicheMatch && matchesFollowerFilter(creator, followers);
    });
  }, [followers, niche]);

  return (
    <div className="space-y-4">
      <TopBar
        searchPlaceholder="Search creators"
        onSearchClick={() => navigate('/brand/select')}
        actions={
          <>
            <button type="button" onClick={() => navigate('/brand/campaigns')} className="fin-topbar-action" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => navigate('/brand/profile')} className="fin-topbar-action" aria-label="Profile">
              <UserRound className="h-4 w-4" />
            </button>
          </>
        }
      />

      <div className="space-y-3">
        <div className="app-scroll-row">
          {nicheOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setNiche(option)}
              className={`fin-chip ${niche === option ? 'fin-chip-active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="app-scroll-row">
          {followerFilterOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFollowers(option)}
              className={`fin-chip ${followers === option ? 'fin-chip-active' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {feed.map((creator) => (
          <CreatorCard
            key={creator.id}
            image={creator.image}
            name={creator.name}
            handle={creator.handle}
            followersLabel={creator.followersLabel}
            engagement={creator.engagement}
            niche={creator.niche}
            fitLabel={getCreatorFitLabel(creator)}
            verified={creator.verified}
            primaryLabel="View"
            onPrimaryClick={() => navigate('/brand/select')}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate('/brand/budget')}
        className="fixed bottom-24 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--accent-foreground)] shadow-lg"
      >
        <Plus className="h-4 w-4" /> Create Campaign
      </button>
    </div>
  );
}
