import { useState } from 'react';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { InfluencerCard } from '../components/InfluencerCard';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router';

export function BrandDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const influencers = [
    {
      id: '1',
      name: '@sarahstyle',
      niche: 'Fashion',
      followers: '45K',
      engagement: '4.2%',
      price: '$350',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: '@fitwithjake',
      niche: 'Fitness',
      followers: '32K',
      engagement: '5.8%',
      price: '$280',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: '@foodiemia',
      niche: 'Food',
      followers: '28K',
      engagement: '6.1%',
      price: '$220',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
      id: '4',
      name: '@travelmatt',
      niche: 'Travel',
      followers: '52K',
      engagement: '3.9%',
      price: '$420',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
    },
    {
      id: '5',
      name: '@techreviewsalex',
      niche: 'Tech',
      followers: '38K',
      engagement: '4.5%',
      price: '$310',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-foreground">SocialTribe</h1>
            <Button variant="ghost" onClick={() => navigate('/brand/campaign/create')}>
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search influencers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        <div className="max-w-md mx-auto">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground hover:bg-white/10 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {['Fashion', 'Fitness', 'Food', 'Travel', 'Tech'].map(cat => (
                <button
                  key={cat}
                  className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors whitespace-nowrap"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {showFilters && (
            <Card glass className="mb-6 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Followers</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Price Range (USD)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">Min Engagement Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 3.5"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                />
              </div>
            </Card>
          )}

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {influencers.length} influencers found
            </p>
          </div>

          <div className="space-y-3">
            {influencers.map(inf => (
              <InfluencerCard
                key={inf.id}
                {...inf}
                onClick={() => navigate(`/influencer/${inf.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
