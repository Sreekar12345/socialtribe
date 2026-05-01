import { ArrowRight, Search, Handshake, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router';

export function Landing() {
  const navigate = useNavigate();

  const categories = [
    'Fashion', 'Fitness', 'Food', 'Travel', 'Tech', 'Beauty', 'Lifestyle', 'Gaming'
  ];

  const featuredInfluencers = [
    {
      id: '1',
      name: '@sarahstyle',
      niche: 'Fashion',
      followers: '45K',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: '2',
      name: '@fitwithjake',
      niche: 'Fitness',
      followers: '32K',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
      id: '3',
      name: '@foodiemia',
      niche: 'Food',
      followers: '28K',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-foreground tracking-tight">SocialTribe</h1>
          <Button variant="ghost" onClick={() => navigate('/brand/dashboard')}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-12">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-muted-foreground mb-6">
            Marketplace for Brand Collaborations
          </div>
          <h1 className="text-4xl mb-4 text-foreground tracking-tight leading-tight">
            Hire Micro-Influencers That Actually Convert
          </h1>
          <p className="text-muted-foreground mb-8">
            Connect with verified influencers. Pay per deliverable. 10% platform fee.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate('/brand/dashboard')}>
              Start as Brand
            </Button>
            <Button variant="secondary" onClick={() => navigate('/influencer/onboard')}>
              Join as Influencer
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-12 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-md mx-auto">
          <h2 className="text-center text-foreground mb-8">How it Works</h2>
          <div className="space-y-4">
            <Card glass>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1">Browse & Filter</h3>
                  <p className="text-sm text-muted-foreground">
                    Search influencers by niche, followers, engagement, and price range
                  </p>
                </div>
              </div>
            </Card>

            <Card glass>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1">Negotiate & Hire</h3>
                  <p className="text-sm text-muted-foreground">
                    Send offers, negotiate terms, and finalize deliverables
                  </p>
                </div>
              </div>
            </Card>

            <Card glass>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1">Track Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor campaign performance and influencer deliverables
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-center text-foreground mb-6">Popular Categories</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <div
                key={cat}
                className="px-4 py-2 bg-secondary border border-border rounded-full text-sm text-foreground hover:bg-white/10 transition-colors cursor-pointer"
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Influencers */}
      <section className="px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-foreground">Featured Influencers</h2>
            <button
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              onClick={() => navigate('/brand/dashboard')}
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {featuredInfluencers.map(inf => (
              <Card
                key={inf.id}
                glass
                className="cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => navigate(`/influencer/${inf.id}`)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={inf.image}
                    alt={inf.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">{inf.name}</h3>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <span>{inf.niche}</span>
                      <span>•</span>
                      <span>{inf.followers} followers</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Fee CTA */}
      <section className="px-6 py-16 bg-gradient-to-t from-transparent to-white/5">
        <div className="max-w-md mx-auto">
          <Card glass className="text-center">
            <DollarSign className="w-12 h-12 text-foreground mx-auto mb-4" />
            <h2 className="text-foreground mb-2">Transparent Pricing</h2>
            <p className="text-muted-foreground mb-6">
              Simple 10% platform fee per transaction. No hidden costs.
            </p>
            <Button onClick={() => navigate('/brand/dashboard')}>
              Get Started
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
}
