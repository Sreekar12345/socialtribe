import { useState } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router';

export function InfluencerOnboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    niche: 'fashion',
    followers: '',
    engagement: '',
    instagram: '',
    priceStory: '',
    pricePost: '',
    priceReel: ''
  });

  const niches = [
    { value: 'fashion', label: 'Fashion' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'tech', label: 'Tech' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'gaming', label: 'Gaming' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/influencer/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button onClick={() => navigate('/')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-foreground">Influencer Onboarding</h2>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <h1 className="text-foreground mb-2">Create Your Profile</h1>
            <p className="text-muted-foreground">
              Set up your profile to start receiving collaboration offers from brands
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <Card glass>
              <label className="block text-sm text-muted-foreground mb-3">Profile Image</label>
              <div className="w-24 h-24 rounded-full bg-secondary border-2 border-dashed border-border flex items-center justify-center mx-auto cursor-pointer hover:bg-white/10 transition-colors">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
            </Card>

            {/* Basic Info */}
            <Card glass className="space-y-4">
              <h3 className="text-foreground">Basic Information</h3>
              <Input
                label="Full Name"
                placeholder="Sarah Johnson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Instagram Handle"
                placeholder="@sarahstyle"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                required
              />
              <Select
                label="Primary Niche"
                options={niches}
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              />
            </Card>

            {/* Analytics */}
            <Card glass className="space-y-4">
              <h3 className="text-foreground">Your Metrics</h3>
              <Input
                label="Followers"
                type="number"
                placeholder="45000"
                value={formData.followers}
                onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                required
              />
              <Input
                label="Average Engagement Rate (%)"
                type="number"
                step="0.1"
                placeholder="4.2"
                value={formData.engagement}
                onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
                required
              />
            </Card>

            {/* Pricing */}
            <Card glass className="space-y-4">
              <h3 className="text-foreground">Set Your Rates (USD)</h3>
              <Input
                label="Story Price"
                type="number"
                placeholder="150"
                value={formData.priceStory}
                onChange={(e) => setFormData({ ...formData, priceStory: e.target.value })}
                required
              />
              <Input
                label="Post Price"
                type="number"
                placeholder="350"
                value={formData.pricePost}
                onChange={(e) => setFormData({ ...formData, pricePost: e.target.value })}
                required
              />
              <Input
                label="Reel Price"
                type="number"
                placeholder="500"
                value={formData.priceReel}
                onChange={(e) => setFormData({ ...formData, priceReel: e.target.value })}
                required
              />
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  Platform fee: 10% deducted from each transaction
                </p>
              </div>
            </Card>

            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
