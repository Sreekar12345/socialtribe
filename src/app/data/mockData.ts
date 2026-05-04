import { influencers } from './influencers';
import { calculatePrice, formatDeliverablesSummary } from '../utils/pricing';

export type CampaignStatus = 'pending' | 'active' | 'completed';

export interface MockCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  creatorIds: string[];
  deadline: string;
  deliverables: string;
  totalCost: number;
}

export interface MockOffer {
  id: string;
  brandName: string;
  deliverables: string;
  deadline: string;
  payment: number;
  instructions: string;
  paymentStatus: 'pending' | 'released';
}

export const budgetOptions = [
  { label: '15K - 25K', value: 25000 },
  { label: '25K - 40K', value: 40000 },
  { label: '40K - 60K', value: 60000 },
  { label: '60K+', value: 60000 },
];

export const industryOptions = ['Fashion', 'Food', 'Beauty', 'Fitness', 'Tech', 'Travel'];
export const nicheOptions = ['All', 'Fitness', 'Food', 'Fashion', 'Travel', 'Beauty', 'Tech'];
export const followerFilterOptions = ['All', '25K+', '50K+', '100K+'];

export const mockBrandCampaigns: MockCampaign[] = [
  {
    id: 'camp-1',
    name: 'Campus launch reel push',
    status: 'pending',
    creatorIds: ['1', '7'],
    deadline: 'May 10, 2026',
    deliverables: formatDeliverablesSummary(['reel', 'story', 'story']),
    totalCost: calculatePrice(influencers[0].price, ['reel', 'story', 'story']) + calculatePrice(influencers[6].price, ['reel']),
  },
  {
    id: 'camp-2',
    name: 'Weekend cafe creator burst',
    status: 'active',
    creatorIds: ['2', '8'],
    deadline: 'May 14, 2026',
    deliverables: formatDeliverablesSummary(['post', 'story', 'story']),
    totalCost: calculatePrice(influencers[1].price, ['post', 'story', 'story']) + calculatePrice(influencers[7].price, ['story', 'story']),
  },
  {
    id: 'camp-3',
    name: 'Seasonal style showcase',
    status: 'completed',
    creatorIds: ['3', '5'],
    deadline: 'Apr 28, 2026',
    deliverables: formatDeliverablesSummary(['reel', 'post']),
    totalCost: calculatePrice(influencers[2].price, ['reel']) + calculatePrice(influencers[4].price, ['post']),
  },
];

export const mockInfluencerOffers: MockOffer[] = [
  {
    id: 'offer-1',
    brandName: 'Acme Co.',
    deliverables: '1 Reel + 2 Stories',
    deadline: 'May 07, 2026',
    payment: 3200,
    instructions: 'Show the product in a real gym routine and tag the brand in the first frame.',
    paymentStatus: 'pending',
  },
  {
    id: 'offer-2',
    brandName: 'Northwind',
    deliverables: '1 Post + 1 Story',
    deadline: 'May 12, 2026',
    payment: 5400,
    instructions: 'Feature the travel kit in a city guide style post with one supporting story.',
    paymentStatus: 'released',
  },
  {
    id: 'offer-3',
    brandName: 'Lumen Beauty',
    deliverables: '3 Stories',
    deadline: 'May 15, 2026',
    payment: 2800,
    instructions: 'Unbox the launch pack and speak about the glow serum in a casual tone.',
    paymentStatus: 'pending',
  },
];

export const mockTransactions = [
  { id: 'txn-1', label: 'Wallet top-up', amount: 10000, kind: 'credit', time: 'Today, 09:40' },
  { id: 'txn-2', label: 'Campaign escrow lock', amount: 8200, kind: 'debit', time: 'Today, 08:15' },
  { id: 'txn-3', label: 'Creator payout release', amount: 5400, kind: 'debit', time: 'Yesterday' },
];

export const mockEarnings = {
  total: 128400,
  pending: 18200,
  paid: 110200,
};

export const mockPerformance = {
  engagement: '5.9%',
  views: '412K',
  likes: '38.4K',
};
