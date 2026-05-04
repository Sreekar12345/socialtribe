import type { Influencer } from '../data/influencers';

export function getCreatorFitLabel(creator: Influencer, budget = 0) {
  if (creator.engagement >= 6) return 'High engagement';
  if (budget > 0 && creator.price <= budget * 0.35) return 'Budget optimized';
  return 'Best fit';
}

export function matchesFollowerFilter(creator: Influencer, filter: string) {
  if (filter === '25K+') return creator.followers >= 25000;
  if (filter === '50K+') return creator.followers >= 50000;
  if (filter === '100K+') return creator.followers >= 100000;
  return true;
}
