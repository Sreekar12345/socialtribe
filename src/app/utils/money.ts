import type { Influencer } from '../data/influencers';

export const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const inrShort = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `₹${n}`;
};

export const aiRecommend = (pool: Influencer[], budget: number, category: string) => {
  const matches = pool.filter((i) => i.available && (category === 'All' || i.niche === category));
  const scored = matches
    .map((i) => ({ i, score: i.engagement * 10 + i.followers / 10000 - i.price / 2000 }))
    .sort((a, b) => b.score - a.score);

  const picked: Influencer[] = [];
  let spent = 0;
  for (const { i } of scored) {
    if (spent + i.price <= budget) {
      picked.push(i);
      spent += i.price;
    }
    if (picked.length >= 5) break;
  }
  return { picked, spent };
};
