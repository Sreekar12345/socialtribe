import type { InfluencerWorkItem } from '../context/InfluencerWorkContext';

type Opportunity = {
  id: string;
  category: string;
  contentType: string;
  estimatedPayout: number;
};

type Analytics = {
  contentTypePerformance: Record<
    string,
    {
      averageEngagement: number;
      campaignCount: number;
    }
  >;
  categoryPerformance: Array<{
    category: string;
    trendScore: number;
    projectedPayout: number;
    averageEngagement: number;
  }>;
  historicalCompletionRate: number;
  pastCampaignPerformance: Array<{
    id: string;
    contentType: string;
    category: string;
    engagement: number;
    status: string;
  }>;
};

export interface EarningsInsight {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  action:
    | { type: 'filter-content'; value: string }
    | { type: 'filter-category'; value: string }
    | { type: 'scroll-opportunities' };
}

function formatCurrency(amount: number) {
  return `\u20B9${amount.toLocaleString('en-IN')}`;
}

function pluralizeContentType(type: string) {
  if (type === 'Story') return 'Stories';
  return `${type}s`;
}

function getLiveCompletionRate(campaigns: InfluencerWorkItem[]) {
  if (campaigns.length === 0) {
    return 0;
  }

  const completed = campaigns.filter((campaign) =>
    ['Submitted', 'Approved'].includes(campaign.status),
  ).length;

  return completed / campaigns.length;
}

export function buildEarningInsights({
  analytics,
  campaigns,
  opportunities,
}: {
  analytics: Analytics;
  campaigns: InfluencerWorkItem[];
  opportunities: Opportunity[];
}) {
  if (
    !analytics ||
    campaigns.length === 0 ||
    opportunities.length === 0 ||
    analytics.pastCampaignPerformance.length === 0
  ) {
    return [];
  }

  const insights: EarningsInsight[] = [];

  const contentEntries = Object.entries(analytics.contentTypePerformance).sort(
    (a, b) => b[1].averageEngagement - a[1].averageEngagement,
  );

  if (contentEntries.length >= 2) {
    const [topType, topMetrics] = contentEntries[0];
    const [, secondMetrics] = contentEntries[1];
    const engagementLift = Math.round(
      ((topMetrics.averageEngagement - secondMetrics.averageEngagement) /
        secondMetrics.averageEngagement) *
        100,
    );

    insights.push({
      id: 'content-performance',
      title: `${pluralizeContentType(topType)} perform better`,
      description: `You get ${engagementLift}% more engagement on ${pluralizeContentType(
        topType,
      )}`,
      actionLabel:
        topType === 'Story'
          ? 'Switch to Stories'
          : `Switch to ${pluralizeContentType(topType)}`,
      action: { type: 'filter-content', value: topType },
    });
  }

  const topCategory = [...analytics.categoryPerformance]
    .filter((category) =>
      opportunities.some((opportunity) => opportunity.category === category.category),
    )
    .sort((a, b) => b.trendScore - a.trendScore)[0];

  if (topCategory) {
    insights.push({
      id: 'category-trend',
      title: 'High paying niche',
      description: `${topCategory.category} campaigns are trending right now`,
      actionLabel: `Explore ${topCategory.category}`,
      action: { type: 'filter-category', value: topCategory.category },
    });
  }

  const liveCompletionRate = getLiveCompletionRate(campaigns);
  const completionRate = Math.round(
    ((analytics.historicalCompletionRate + liveCompletionRate) / 2) * 100,
  );
  const boostAmount = opportunities
    .slice()
    .sort((a, b) => b.estimatedPayout - a.estimatedPayout)
    .slice(0, 2)
    .reduce((sum, opportunity) => sum + opportunity.estimatedPayout, 0);

  insights.push({
    id: 'earnings-potential',
    title:
      completionRate >= 85 ? 'High reliability unlocks more' : 'Boost earnings',
    description:
      completionRate >= 85
        ? `Your ${completionRate}% completion rate opens +${formatCurrency(
            boostAmount,
          )} in campaigns`
        : `Accept 2 more campaigns this week to earn +${formatCurrency(
            boostAmount,
          )}`,
    actionLabel: 'View Opportunities',
    action: { type: 'scroll-opportunities' },
  });

  return insights.slice(0, 3);
}
