export interface Influencer {
  id: string;
  name: string;
  handle: string;
  niche: string;
  followers: number;
  followersLabel: string;
  engagement: number;
  price: number;
  image: string;
  verified: boolean;
  available: boolean;
  completion: number;
}

export const influencers: Influencer[] = [
  { id: '1', name: 'Maya Chen', handle: '@mayalifts', niche: 'Fitness', followers: 48000, followersLabel: '48K', engagement: 5.8, price: 4800, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop', verified: true, available: true, completion: 96 },
  { id: '2', name: 'Jordan Pak', handle: '@jordaneats', niche: 'Food', followers: 72000, followersLabel: '72K', engagement: 4.2, price: 7200, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', verified: true, available: true, completion: 92 },
  { id: '3', name: 'Riya Shah', handle: '@riyastyles', niche: 'Fashion', followers: 95000, followersLabel: '95K', engagement: 3.9, price: 9500, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', verified: true, available: true, completion: 98 },
  { id: '4', name: 'Leo Martin', handle: '@leo.travels', niche: 'Travel', followers: 38000, followersLabel: '38K', engagement: 6.4, price: 3800, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop', verified: false, available: true, completion: 88 },
  { id: '5', name: 'Ava Nolan', handle: '@avabeauty', niche: 'Beauty', followers: 112000, followersLabel: '112K', engagement: 4.7, price: 12500, image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop', verified: true, available: false, completion: 94 },
  { id: '6', name: 'Sam Okafor', handle: '@samtech', niche: 'Tech', followers: 56000, followersLabel: '56K', engagement: 5.1, price: 5600, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop', verified: true, available: true, completion: 91 },
  { id: '7', name: 'Nina Park', handle: '@ninafit', niche: 'Fitness', followers: 29000, followersLabel: '29K', engagement: 7.1, price: 2900, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop', verified: false, available: true, completion: 86 },
  { id: '8', name: 'Diego Ruiz', handle: '@diegocooks', niche: 'Food', followers: 84000, followersLabel: '84K', engagement: 4.5, price: 8400, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop', verified: true, available: true, completion: 93 },
];

export const categories = ['All', 'Fitness', 'Food', 'Fashion', 'Travel', 'Beauty', 'Tech'];
