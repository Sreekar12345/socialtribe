import { ArrowLeft, Users, TrendingUp, Instagram, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useNavigate, useParams } from 'react-router';

export function InfluencerProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const profile = {
    name: 'Sarah Johnson',
    handle: '@sarahstyle',
    niche: 'Fashion',
    bio: 'NYC-based fashion creator specializing in sustainable streetwear and minimalist style. Partnered with 50+ eco-conscious brands.',
    followers: '45.2K',
    avgLikes: '1.9K',
    engagement: '4.2%',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    niches: ['Fashion', 'Sustainable Living', 'Streetwear'],
    pricing: {
      story: '$150',
      post: '$350',
      reel: '$500'
    },
    collaborations: [
      { brand: 'EcoThreads', deliverable: 'Instagram Reel', date: 'Mar 2026' },
      { brand: 'GreenWear Co', deliverable: '2 Posts + Story', date: 'Feb 2026' },
      { brand: 'Urban Minimalist', deliverable: '3 Stories', date: 'Jan 2026' }
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-foreground">Influencer Profile</h2>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Profile Header */}
          <Card glass>
            <div className="flex gap-4 mb-4">
              <img
                src={profile.image}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h1 className="text-foreground mb-1">{profile.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Instagram className="w-4 h-4" />
                  <span className="text-sm">{profile.handle}</span>
                </div>
                <div className="inline-block px-2 py-1 bg-white/10 rounded text-xs text-foreground">
                  {profile.niche}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>
            <div className="flex gap-6 text-sm">
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span>Followers</span>
                </div>
                <div className="text-foreground">{profile.followers}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>Avg Likes</span>
                </div>
                <div className="text-foreground">{profile.avgLikes}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Engagement</div>
                <div className="text-foreground">{profile.engagement}</div>
              </div>
            </div>
          </Card>

          {/* Niches */}
          <Card glass>
            <h3 className="text-foreground mb-3">Specializations</h3>
            <div className="flex flex-wrap gap-2">
              {profile.niches.map(niche => (
                <div
                  key={niche}
                  className="px-3 py-1.5 bg-secondary border border-border rounded-full text-sm text-foreground"
                >
                  {niche}
                </div>
              ))}
            </div>
          </Card>

          {/* Pricing */}
          <Card glass>
            <h3 className="text-foreground mb-4">Pricing</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Story</span>
                <span className="text-foreground">{profile.pricing.story}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Post</span>
                <span className="text-foreground">{profile.pricing.post}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reel</span>
                <span className="text-foreground">{profile.pricing.reel}</span>
              </div>
            </div>
            <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                + 10% platform fee
              </p>
            </div>
          </Card>

          {/* Previous Collaborations */}
          <Card glass>
            <h3 className="text-foreground mb-4">Previous Collaborations</h3>
            <div className="space-y-3">
              {profile.collaborations.map((collab, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-foreground">{collab.brand}</div>
                    <div className="text-sm text-muted-foreground">{collab.deliverable}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{collab.date}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* CTA */}
          <div className="sticky bottom-6">
            <Button
              className="w-full"
              onClick={() => navigate(`/deal/${id}`)}
            >
              Send Offer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
