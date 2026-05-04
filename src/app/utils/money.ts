import type { Influencer } from '../data/influencers';
import {
  getCampaignBudgetLimit,
  type CampaignBudgetRange,
} from './campaignBudget';

const INR_SYMBOL = '\u20B9';

export const inr = (n: number) => `${INR_SYMBOL}${n.toLocaleString('en-IN')}`;

export const inrShort = (n: number) => {
  if (n >= 100000) return `${INR_SYMBOL}${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `${INR_SYMBOL}${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${INR_SYMBOL}${n}`;
};

export const getNicheFilterFromIndustry = (industry?: string) => {
  switch (industry) {
    case 'Fashion':
    case 'Food':
    case 'Beauty':
      return industry;
    case 'SaaS':
      return 'Tech';
    default:
      return 'All';
  }
};

function scoreInfluencer(item: Influencer) {
  return item.engagement * 100 + item.followers / 1000 - item.price / 10000;
}

function sortInfluencersForDisplay(items: Influencer[]) {
  return [...items].sort((left, right) => {
    if (right.engagement !== left.engagement) {
      return right.engagement - left.engagement;
    }

    if (right.followers !== left.followers) {
      return right.followers - left.followers;
    }

    return left.price - right.price;
  });
}

export const aiRecommend = (
  pool: Influencer[],
  budgetRange: CampaignBudgetRange,
  nicheFilter: string,
) => {
  const budgetLimit = getCampaignBudgetLimit(budgetRange.max);
  const matches = pool.filter(
    (item) =>
      item.available &&
      item.price <= budgetLimit &&
      (nicheFilter === 'All' || item.niche === nicheFilter),
  );

  let bestPlan: {
    picked: Influencer[];
    spent: number;
    quality: number;
    withinRange: boolean;
  } | null = null;

  const combinationCount = 1 << matches.length;

  for (let mask = 1; mask < combinationCount; mask += 1) {
    const picked: Influencer[] = [];
    let spent = 0;
    let quality = 0;

    for (let index = 0; index < matches.length; index += 1) {
      if ((mask & (1 << index)) === 0) continue;

      const item = matches[index];
      picked.push(item);
      spent += item.price;
      quality += scoreInfluencer(item);

      if (picked.length > 5 || spent > budgetLimit) {
        break;
      }
    }

    if (picked.length === 0 || picked.length > 5 || spent > budgetLimit) {
      continue;
    }

    const withinRange = spent >= budgetRange.min;

    if (!bestPlan) {
      bestPlan = { picked, spent, quality, withinRange };
      continue;
    }

    if (withinRange !== bestPlan.withinRange) {
      if (withinRange) {
        bestPlan = { picked, spent, quality, withinRange };
      }
      continue;
    }

    if (quality !== bestPlan.quality) {
      if (quality > bestPlan.quality) {
        bestPlan = { picked, spent, quality, withinRange };
      }
      continue;
    }

    if (spent > bestPlan.spent) {
      bestPlan = { picked, spent, quality, withinRange };
    }
  }

  if (!bestPlan) {
    return { picked: [], spent: 0 };
  }

  return {
    picked: sortInfluencersForDisplay(bestPlan.picked),
    spent: bestPlan.spent,
  };
};
