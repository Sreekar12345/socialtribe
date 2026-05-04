export const brandPreviousCampaigns = [
  {
    id: 'camp-1',
    title: 'Summer Drop Launch',
    status: 'Active',
    reach: '48,000',
    engagement: '5.4%',
    description: 'Creator rollout for seasonal product launch.',
  },
  {
    id: 'camp-2',
    title: 'Campus Ambassador Push',
    status: 'Completed',
    reach: '31,200',
    engagement: '4.1%',
    description: 'Short-form student ambassador awareness push.',
  },
  {
    id: 'camp-3',
    title: 'Weekend Story Burst',
    status: 'Completed',
    reach: '18,900',
    engagement: '3.8%',
    description: 'Story-first promo for limited inventory.',
  },
  {
    id: 'camp-4',
    title: 'Creator Review Wave',
    status: 'Active',
    reach: '54,600',
    engagement: '6.2%',
    description: 'UGC review campaign across lifestyle creators.',
  },
];

export const brandConversations = [
  {
    id: 'chat-1',
    name: 'Aarav Sharma',
    preview: 'Draft looks good. Sending the final cut tonight.',
  },
  {
    id: 'chat-2',
    name: 'Mira Joseph',
    preview: 'Can we confirm the posting window for tomorrow?',
  },
  {
    id: 'chat-3',
    name: 'Kian Patel',
    preview: 'Uploaded the revised caption for approval.',
  },
];

export const influencerConversations = [
  {
    id: 'chat-1',
    name: 'Nova Studio',
    preview: 'Please share the final story frames before noon.',
  },
  {
    id: 'chat-2',
    name: 'Pulse Labs',
    preview: 'We liked version two. Moving ahead with that cut.',
  },
  {
    id: 'chat-3',
    name: 'Orbit Goods',
    preview: 'Can you submit the preview by Friday evening?',
  },
];

export const influencerActiveWork = [
  {
    id: 'work-1',
    title: 'Spring Edit Reel',
    brandName: 'Nova Studio',
    contentType: 'Reel',
    status: 'Pending',
    description:
      'Create a short engaging reel showcasing the product in a natural setting. Highlight key features and include a call-to-action directing users to visit the brand page.',
    deliverables: [
      '1 Instagram Reel',
      'Minimum 15 seconds',
      'Tag @nova_studio',
      'Use hashtag #NovaCampaign',
    ],
    deadline: '30 May 2026',
    guidelines: [
      'Keep content authentic and non-promotional',
      'Avoid mentioning competitors',
      'Maintain brand tone',
    ],
  },
  {
    id: 'work-2',
    title: 'Lifestyle Product Story',
    brandName: 'Pulse Labs',
    contentType: 'Story',
    status: 'Submitted',
    description:
      'Create a story sequence that introduces the product in your everyday routine and clearly shows the main use case for your audience.',
    deliverables: [
      '3 Instagram Stories',
      'Show the product in use',
      'Tag @pulselabs',
      'Use hashtag #PulsePartner',
    ],
    deadline: '28 May 2026',
    guidelines: [
      'Keep the story flow natural and creator-first',
      'Do not compare against competing products',
      'Follow the provided tone of voice',
    ],
  },
  {
    id: 'work-3',
    title: 'Daily Carry Feature',
    brandName: 'Orbit Goods',
    contentType: 'Post',
    status: 'Approved',
    description:
      'Create a clean feed post showing how the product fits into your daily carry, with a short caption that highlights practical value.',
    deliverables: [
      '1 Instagram Post',
      'Caption with product mention',
      'Tag @orbitgoods',
      'Use hashtag #OrbitCarry',
    ],
    deadline: '24 May 2026',
    guidelines: [
      'Keep the content visually simple and product-led',
      'Avoid competitor references',
      'Match the approved brand tone',
    ],
  },
  {
    id: 'work-4',
    title: 'Wellness Launch Story',
    brandName: 'Luma Health',
    contentType: 'Story',
    status: 'Rejected',
    description:
      'Create a story-based launch sequence focused on how the product fits into a healthy daily routine and why your audience should care.',
    deliverables: [
      '4 Instagram Stories',
      'Include product close-up',
      'Tag @lumahealth',
      'Use hashtag #LumaLaunch',
    ],
    deadline: '26 May 2026',
    guidelines: [
      'Stay authentic and educational',
      'Do not mention alternative brands',
      'Maintain the wellness-focused brand tone',
    ],
  },
];

export const influencerOpportunities = [
  {
    id: 'campaign-1',
    title: 'Campus Launch Story Set',
    brand: 'XYZ Brand',
    category: 'Lifestyle',
    contentType: 'Reel',
    estimatedPayout: 2200,
    description: 'Story-first collaboration for a limited campus drop.',
    deadline: '30 May 2026',
    deliverables: ['1 Reel', '2 Stories'],
  },
  {
    id: 'campaign-2',
    title: 'Desk Setup Creator Reel',
    brand: 'Nova Devices',
    category: 'Tech',
    contentType: 'Reel',
    estimatedPayout: 2600,
    description: 'Short-form reel featuring a new productivity accessory.',
    deadline: '02 June 2026',
    deliverables: ['1 Reel', '1 Story'],
  },
  {
    id: 'campaign-3',
    title: 'Weekend Wellness Post',
    brand: 'MoveWell',
    category: 'Fitness',
    contentType: 'Post',
    estimatedPayout: 1800,
    description: 'Feed post campaign built around routine and recovery.',
    deadline: '05 June 2026',
    deliverables: ['1 Post', '2 Stories'],
  },
  {
    id: 'campaign-4',
    title: 'Recovery Routine Story Pack',
    brand: 'CoreFuel',
    category: 'Fitness',
    contentType: 'Story',
    estimatedPayout: 2400,
    description: 'Story-led fitness campaign focused on recovery habits.',
    deadline: '08 June 2026',
    deliverables: ['3 Stories', '1 Product tag'],
  },
];

export const influencerPerformanceAnalytics = {
  contentTypePerformance: {
    Reel: {
      averageEngagement: 6.1,
      campaignCount: 8,
    },
    Post: {
      averageEngagement: 4.7,
      campaignCount: 5,
    },
    Story: {
      averageEngagement: 4.3,
      campaignCount: 6,
    },
  },
  categoryPerformance: [
    {
      category: 'Fitness',
      trendScore: 91,
      projectedPayout: 4200,
      averageEngagement: 6.3,
    },
    {
      category: 'Tech',
      trendScore: 84,
      projectedPayout: 3100,
      averageEngagement: 5.4,
    },
    {
      category: 'Lifestyle',
      trendScore: 76,
      projectedPayout: 2600,
      averageEngagement: 4.9,
    },
  ],
  historicalCompletionRate: 0.92,
  pastCampaignPerformance: [
    {
      id: 'past-1',
      contentType: 'Reel',
      category: 'Fitness',
      engagement: 6.4,
      status: 'Approved',
    },
    {
      id: 'past-2',
      contentType: 'Post',
      category: 'Lifestyle',
      engagement: 4.6,
      status: 'Approved',
    },
    {
      id: 'past-3',
      contentType: 'Story',
      category: 'Fitness',
      engagement: 4.1,
      status: 'Submitted',
    },
  ],
} as const;

export const influencerPayoutEntries = [
  {
    id: 'payout-1',
    title: 'City Walk Reel',
    brandName: 'Nova Studio',
    contentType: 'Reel',
    status: 'Completed',
    earned: '₹2,500',
  },
  {
    id: 'payout-2',
    title: 'New Arrival Story Set',
    brandName: 'Pulse Labs',
    contentType: 'Story',
    status: 'Pending',
    earned: '₹1,700',
  },
  {
    id: 'payout-3',
    title: 'Weekend Launch Post',
    brandName: 'Orbit Goods',
    contentType: 'Post',
    status: 'Completed',
    earned: '₹2,100',
  },
  {
    id: 'payout-4',
    title: 'Campus Buzz Reel',
    brandName: 'XYZ Brand',
    contentType: 'Reel',
    status: 'Completed',
    earned: '₹3,200',
  },
  {
    id: 'payout-5',
    title: 'Wellness Habit Story',
    brandName: 'MoveWell',
    contentType: 'Story',
    status: 'Pending',
    earned: '₹1,400',
  },
];

export const influencerEarningsOverview = {
  totalEarned: '₹12,500',
  thisMonth: '₹4,200',
  completedCampaigns: '8',
  pendingPayments: '2',
} as const;

export const influencerPerformanceInsight =
  'Your reels are generating higher engagement compared to posts. Focus more on reels to increase payouts.';

export const profileData = {
  brand: {
    name: 'SocialTribe Studio',
    email: 'brand@socialtribe.app',
    role: 'Brand',
    industry: 'Lifestyle Commerce',
    tagline: 'Creator-led launches built for community-first brands.',
    websiteUrl: 'https://socialtribe.app',
    campaignsRun: '24',
    activeCampaigns: '3',
    influencersWorked: '48',
    contentTypes: ['Story', 'Reel'] as string[],
    categories: ['Fashion', 'Tech', 'Fitness'] as string[],
  },
  influencer: {
    name: 'Aanya Rao',
    email: 'creator@socialtribe.app',
    role: 'Influencer',
    score: '78',
    engagementRate: '4.2%',
    followers: '12,400',
    pricing: {
      reel: '₹2,000 – ₹4,000',
      post: '₹1,500 – ₹3,000',
      story: '₹500 – ₹1,000',
    },
  },
} as const;

export const brandIndustryOptions = [
  'Lifestyle Commerce',
  'Fashion',
  'Tech',
  'Fitness',
  'Beauty',
  'Food',
] as const;

export const brandContentTypeOptions = ['Story', 'Post', 'Reel'] as const;

export const brandCategoryOptions = [
  'Fashion',
  'Tech',
  'Fitness',
  'Beauty',
  'Food',
  'Travel',
] as const;

export function findInfluencerOpportunity(id: string) {
  return influencerOpportunities.find((opportunity) => opportunity.id === id);
}

export function findInfluencerWork(id: string) {
  return influencerActiveWork.find((campaign) => campaign.id === id);
}
