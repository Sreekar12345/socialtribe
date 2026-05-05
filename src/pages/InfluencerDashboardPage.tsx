import { MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  influencerOpportunities,
  influencerPriorityOpportunityTriggers,
  profileData,
} from '../data/dashboardMockData';
import { loadConnectedInfluencerAccount } from '../utils/influencerSignup';

type OpportunityFilter = 'All' | 'Reel' | 'Post' | 'Story';

const opportunityFilters: OpportunityFilter[] = ['All', 'Reel', 'Post', 'Story'];

function formatCountdown(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

function toTitleCase(value: string) {
  if (!value) {
    return '';
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function InfluencerDashboardPage() {
  usePageTitle('Influencer dashboard');

  const navigate = useNavigate();
  const influencer = profileData.influencer;
  const connectedAccount = useMemo(() => loadConnectedInfluencerAccount(), []);
  const [opportunityFilter, setOpportunityFilter] =
    useState<OpportunityFilter>('All');
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const filteredOpportunities = useMemo(
    () =>
      influencerOpportunities.filter((opportunity) =>
        opportunityFilter === 'All'
          ? true
          : opportunity.contentType === opportunityFilter,
      ),
    [opportunityFilter],
  );

  const priorityTriggerWindows = useMemo(() => {
    const baseTimestamp = Date.now();

    return influencerPriorityOpportunityTriggers.map((trigger) => ({
      ...trigger,
      expiresAt:
        baseTimestamp +
        Math.max(0, (120 - trigger.triggeredMinutesAgo) * 60 * 1000),
    }));
  }, []);

  const priorityOpportunities = useMemo(() => {
    const matchingNiches = new Set([
      ...influencer.nicheTags,
      ...(connectedAccount?.category
        ? [toTitleCase(connectedAccount.category)]
        : []),
    ]);
    const followerCount =
      connectedAccount?.followers ?? influencer.followersCount;
    const engagementRate =
      connectedAccount?.engagementRate ?? influencer.engagementRateValue;

    return priorityTriggerWindows
      .map((trigger) => {
        const opportunity = influencerOpportunities.find(
          (item) => item.id === trigger.opportunityId,
        );

        if (!opportunity) {
          return null;
        }

        const matchesNiche = matchingNiches.has(opportunity.category);
        const matchesFollowers =
          followerCount >= trigger.followerRange.min &&
          followerCount <= trigger.followerRange.max;
        const matchesEngagement =
          engagementRate >= trigger.engagementRange.min &&
          engagementRate <= trigger.engagementRange.max;
        const remainingMs = trigger.expiresAt - currentTime;

        if (
          !matchesNiche ||
          !matchesFollowers ||
          !matchesEngagement ||
          remainingMs <= 0
        ) {
          return null;
        }

        return {
          ...opportunity,
          priorityId: trigger.id,
          remainingMs,
        };
      })
      .filter(
        (
          opportunity,
        ): opportunity is (typeof influencerOpportunities)[number] & {
          priorityId: string;
          remainingMs: number;
        } => opportunity !== null,
      )
      .sort((left, right) => left.remainingMs - right.remainingMs)
      .slice(0, 3);
  }, [
    connectedAccount?.category,
    connectedAccount?.engagementRate,
    connectedAccount?.followers,
    currentTime,
    influencer.engagementRateValue,
    influencer.followersCount,
    influencer.nicheTags,
    priorityTriggerWindows,
  ]);

  const displayName = connectedAccount
    ? `@${connectedAccount.username}`
    : influencer.name;
  const displayScore = connectedAccount
    ? String(connectedAccount.scorePercent)
    : influencer.score;
  const displayEngagement = connectedAccount
    ? `${connectedAccount.engagementRate.toFixed(1)}%`
    : influencer.engagementRate;
  const displayFollowers = connectedAccount
    ? connectedAccount.followers.toLocaleString('en-IN')
    : influencer.followers;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
            Welcome back, {displayName}
          </h1>
          <p className="text-sm leading-6 text-neutral-600">
            Here&apos;s your activity overview
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/influencer/chat')}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-950 transition hover:bg-[#f7f7f5]"
          aria-label="Open chat"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-black/5 bg-white p-4 shadow-none">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Score
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {displayScore}
          </p>
        </Card>
        <Card className="border-black/5 bg-white p-4 shadow-none">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Engagement
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {displayEngagement}
          </p>
        </Card>
        <Card className="border-black/5 bg-white p-4 shadow-none">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Followers
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {displayFollowers}
          </p>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
            &#9889; Priority Opportunities
          </h2>
        </div>

        {priorityOpportunities.length > 0 ? (
          <div className="space-y-4">
            {priorityOpportunities.map((opportunity) => (
              <Card
                key={opportunity.priorityId}
                className="border-black/5 bg-[#fbfaf7] p-6 shadow-none"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-base font-semibold text-neutral-950">
                        {opportunity.title}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {opportunity.brand}
                      </p>
                    </div>

                    <p className="shrink-0 font-mono text-sm font-semibold tracking-[0.12em] text-neutral-950">
                      {formatCountdown(opportunity.remainingMs)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">
                      {opportunity.contentType}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700">
                      {'\uD83D\uDD25 1 slot open'}
                    </span>
                  </div>

                  <Button
                    fullWidth
                    onClick={() =>
                      navigate(`/influencer/campaign/${opportunity.id}`)
                    }
                  >
                    Accept Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-black/5 bg-[#fbfaf7] p-6 text-center shadow-none">
            <p className="text-sm text-neutral-600">
              No priority openings right now. Urgent matches will appear here
              automatically.
            </p>
          </Card>
        )}
      </section>

      <section className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
              New Opportunities
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {opportunityFilters.map((filter) => {
              const active = opportunityFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setOpportunityFilter(filter)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-neutral-950 text-white'
                      : 'border border-black/10 bg-white text-neutral-700'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {filteredOpportunities.length > 0 ? (
          <div className="space-y-4">
            {filteredOpportunities.map((opportunity) => (
              <Card
                key={opportunity.id}
                className="border-black/5 bg-white p-5 shadow-none"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-base font-semibold text-neutral-950">
                        {opportunity.title}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {opportunity.category}
                      </p>
                      <p className="truncate text-sm leading-6 text-neutral-600">
                        {opportunity.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#f7f7f5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700">
                      {opportunity.contentType}
                    </span>
                  </div>

                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() =>
                      navigate(`/influencer/campaign/${opportunity.id}`)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-black/5 bg-white p-5 text-center shadow-none">
            <p className="text-sm text-neutral-600">
              No opportunities match this filter yet.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
