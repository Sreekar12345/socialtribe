import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useInfluencerWork } from '../context/InfluencerWorkContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  influencerPerformanceAnalytics,
  influencerOpportunities,
  profileData,
} from '../data/dashboardMockData';
import {
  buildEarningInsights,
  type EarningsInsight,
} from '../utils/influencerInsights';

export function InfluencerDashboardPage() {
  usePageTitle('Influencer dashboard');

  const navigate = useNavigate();
  const influencer = profileData.influencer;
  const { campaigns } = useInfluencerWork();
  const opportunitiesRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeContentType, setActiveContentType] = useState<string | null>(
    null,
  );

  const filteredOpportunities = useMemo(
    () =>
      influencerOpportunities.filter((opportunity) => {
        const matchesCategory = activeCategory
          ? opportunity.category === activeCategory
          : true;
        const matchesContentType = activeContentType
          ? opportunity.contentType === activeContentType
          : true;

        return matchesCategory && matchesContentType;
      }),
    [activeCategory, activeContentType],
  );

  const insights = useMemo(
    () =>
      buildEarningInsights({
        analytics: influencerPerformanceAnalytics,
        campaigns,
        opportunities: influencerOpportunities,
      }),
    [campaigns],
  );

  function scrollToOpportunities() {
    opportunitiesRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function handleInsightAction(insight: EarningsInsight) {
    if (insight.action.type === 'filter-content') {
      setActiveContentType(insight.action.value);
      setActiveCategory(null);
      scrollToOpportunities();
      return;
    }

    if (insight.action.type === 'filter-category') {
      setActiveCategory(insight.action.value);
      setActiveContentType(null);
      scrollToOpportunities();
      return;
    }

    scrollToOpportunities();
  }

  const activeFilterLabel = activeCategory
    ? `${activeCategory} opportunities`
    : activeContentType
      ? `${activeContentType} opportunities`
      : null;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
            Welcome back, {influencer.name}
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

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Score
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {influencer.score}
          </p>
        </Card>
        <Card className="border-[#c5b0f4] bg-[#f4f0fd] p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Engagement
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {influencer.engagementRate}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Followers
          </p>
          <p className="mt-3 text-xl font-semibold text-neutral-950">
            {influencer.followers}
          </p>
        </Card>
      </div>

      <div ref={opportunitiesRef} className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
            New Opportunities
          </h2>
          {activeFilterLabel ? (
            <button
              type="button"
              onClick={() => {
                setActiveCategory(null);
                setActiveContentType(null);
              }}
              className="text-xs font-medium text-neutral-600 underline"
            >
              Reset
            </button>
          ) : null}
        </div>

        {activeFilterLabel ? (
          <p className="text-sm text-neutral-600">
            Showing {activeFilterLabel}
          </p>
        ) : null}

        {filteredOpportunities.map((item, index) => (
          <Card
            key={item.id}
            className={
              index % 2 === 0 ? 'p-5' : 'border-[#c5b0f4] bg-[#f4f0fd] p-5'
            }
          >
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-semibold text-neutral-950">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-neutral-700">
                  {item.category}
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  {item.description}
                </p>
              </div>

              <Button
                fullWidth
                onClick={() => navigate(`/influencer/campaign/${item.id}`)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}

        {filteredOpportunities.length === 0 ? (
          <Card className="p-5 text-center">
            <p className="text-sm text-neutral-600">
              No opportunities match this earning focus yet.
            </p>
          </Card>
        ) : null}
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
          Grow Your Earnings
        </h2>

        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.25 }}
            >
              <Card className="p-5 transition hover:-translate-y-0.5">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-950">
                      {insight.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">
                      {insight.description}
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => handleInsightAction(insight)}
                  >
                    {insight.actionLabel}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-5">
            <p className="text-sm text-neutral-600">
              Complete your first campaign to unlock earning insights
            </p>
          </Card>
        )}
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-950">
            Quick Action
          </h2>
          <Button
            fullWidth
            onClick={() => navigate('/influencer/campaigns')}
          >
            Browse Campaigns
          </Button>
        </div>
      </Card>
    </div>
  );
}
