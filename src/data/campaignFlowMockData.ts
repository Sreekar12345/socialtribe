import { getBudgetRangeValue } from '../constants/budgetOptions';
import type { CampaignDeliverableCounts } from '../utils/campaignSchedule';

type ContentTypeLabel = 'Story' | 'Post' | 'Reel';
type PricingRange = [number, number];

export interface CampaignInfluencer {
  id: string;
  username: string;
  category: string;
  followers: string;
  followersCount: number;
  engagement: string;
  engagementRate: number;
  previousWork: string[];
  pricing: {
    reel: PricingRange;
    post: PricingRange;
    story: PricingRange;
  };
}

export const campaignInfluencers: CampaignInfluencer[] = [
  {
    id: 'influencer-1',
    username: '@mayaedits',
    category: 'Fashion',
    followers: '42,100',
    followersCount: 42100,
    engagement: '4.8%',
    engagementRate: 4.8,
    previousWork: [
      'Spring outfit reel for a lifestyle launch',
      'Creator story set featuring a skincare routine',
      'Brand feature post with audience Q&A',
    ],
    pricing: {
      reel: [2000, 4000],
      post: [1500, 3000],
      story: [500, 1000],
    },
  },
  {
    id: 'influencer-2',
    username: '@rahulframes',
    category: 'Tech',
    followers: '28,900',
    followersCount: 28900,
    engagement: '5.1%',
    engagementRate: 5.1,
    previousWork: [
      'Short-form gadget review series',
      'Product walkthrough story sequence',
      'Community feedback post for a device drop',
    ],
    pricing: {
      reel: [2200, 3800],
      post: [1400, 2800],
      story: [600, 1100],
    },
  },
  {
    id: 'influencer-3',
    username: '@naina.table',
    category: 'Food',
    followers: '35,400',
    followersCount: 35400,
    engagement: '4.5%',
    engagementRate: 4.5,
    previousWork: [
      'Restaurant launch reel with tasting clips',
      'Menu spotlight story set',
      'Weekend cafe feature carousel',
    ],
    pricing: {
      reel: [1800, 3400],
      post: [1300, 2600],
      story: [500, 900],
    },
  },
  {
    id: 'influencer-4',
    username: '@advikmoves',
    category: 'Fitness',
    followers: '51,700',
    followersCount: 51700,
    engagement: '6.0%',
    engagementRate: 6,
    previousWork: [
      'Workout challenge collaboration reel',
      'Recovery tips story sequence',
      'Supplement brand post with creator commentary',
    ],
    pricing: {
      reel: [2600, 4200],
      post: [1700, 3200],
      story: [700, 1200],
    },
  },
  {
    id: 'influencer-5',
    username: '@nina.fit',
    category: 'Fitness',
    followers: '29,000',
    followersCount: 29000,
    engagement: '7.1%',
    engagementRate: 7.1,
    previousWork: [
      'High-intensity gym reel for a creator challenge',
      'Progress update story sequence',
      'Recovery post with product integration',
    ],
    pricing: {
      reel: [2000, 4000],
      post: [1500, 3000],
      story: [500, 1000],
    },
  },
];

export const recommendedInfluencers = campaignInfluencers;

export const influencerCampaignOpportunities = [
  {
    id: 'campaign-1',
    title: 'Launch Week Story Series',
    shortDescription: 'Story-first brand awareness campaign.',
    description:
      'Create a concise story sequence introducing the brand and highlighting the new product line across your audience segments.',
    requirements: [
      'Create one story sequence',
      'Share brand mention in the final frame',
      'Deliver the first draft before the review window closes',
    ],
  },
  {
    id: 'campaign-2',
    title: 'Creator Feature Reel',
    shortDescription: 'Short-form reel for a seasonal drop.',
    description:
      'Produce a reel that features the product in a day-in-the-life or use-case style format aligned with your content category.',
    requirements: [
      'One vertical reel submission',
      'Use the provided campaign talking points',
      'Keep the visual style native to your feed',
    ],
  },
  {
    id: 'campaign-3',
    title: 'Community Engagement Post',
    shortDescription: 'Post-based campaign with audience interaction.',
    description:
      'Publish a feed-style concept that invites your audience to engage with the campaign theme and respond to a simple prompt.',
    requirements: [
      'One feed post concept',
      'Caption must include the campaign theme',
      'Audience prompt must appear in the post copy',
    ],
  },
];

export function findRecommendedInfluencer(id: string) {
  return campaignInfluencers.find((influencer) => influencer.id === id);
}

export function findInfluencerCampaign(id: string) {
  return influencerCampaignOpportunities.find((campaign) => campaign.id === id);
}

function toPricingKey(type: ContentTypeLabel) {
  return type.toLowerCase() as keyof CampaignInfluencer['pricing'];
}

export function getCampaignBudgetValue(
  budgetRange: string,
  customBudget: string,
) {
  const parsedCustomBudget = Number.parseInt(customBudget, 10);

  if (Number.isFinite(parsedCustomBudget) && parsedCustomBudget > 0) {
    return parsedCustomBudget;
  }

  return getBudgetRangeValue(budgetRange);
}

export function formatCurrency(amount: number) {
  return `\u20B9${amount.toLocaleString('en-IN')}`;
}

export function getEstimatedCost(
  influencer: CampaignInfluencer,
  deliverableCounts: CampaignDeliverableCounts,
) {
  return Object.entries(deliverableCounts).reduce((total, [type, count]) => {
    if (count <= 0) {
      return total;
    }

    const [, max] = influencer.pricing[toPricingKey(type as ContentTypeLabel)];
    return total + max * count;
  }, 0);
}

export function getSelectionCost(
  influencerIds: string[],
  deliverableCounts: CampaignDeliverableCounts,
) {
  return campaignInfluencers
    .filter((influencer) => influencerIds.includes(influencer.id))
    .reduce(
      (total, influencer) =>
        total + getEstimatedCost(influencer, deliverableCounts),
      0,
    );
}

export function buildPlan(
  influencers: CampaignInfluencer[],
  campaign: {
    budget: number;
    deliverableCounts: CampaignDeliverableCounts;
  },
) {
  let totalCost = 0;
  const selected: Array<CampaignInfluencer & { estimatedCost: number }> = [];

  for (const influencer of influencers) {
    const estimatedCost = getEstimatedCost(
      influencer,
      campaign.deliverableCounts,
    );

    if (totalCost + estimatedCost <= campaign.budget) {
      selected.push({ ...influencer, estimatedCost });
      totalCost += estimatedCost;
    }
  }

  return {
    selected,
    totalCost,
    remaining: Math.max(campaign.budget - totalCost, 0),
    utilization:
      campaign.budget > 0
        ? Math.round((totalCost / campaign.budget) * 100)
        : 0,
  };
}

export function getEstimatedReach(influencers: CampaignInfluencer[]) {
  const totalFollowers = influencers.reduce(
    (sum, influencer) => sum + influencer.followersCount,
    0,
  );

  return Math.round(totalFollowers * 2.2);
}
