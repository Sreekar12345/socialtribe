import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router';

export function CreateCampaign() {
  const navigate = useNavigate();
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    budget: '',
    deliverable: 'post',
    timeline: '',
    description: ''
  });

  const deliverables = [
    { value: 'story', label: 'Story' },
    { value: 'post', label: 'Post' },
    { value: 'reel', label: 'Reel' },
    { value: 'multiple', label: 'Multiple' }
  ];

  const availableInfluencers = [
    { id: '1', name: '@sarahstyle', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { id: '2', name: '@fitwithjake', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { id: '3', name: '@foodiemia', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' }
  ];

  const toggleInfluencer = (id: string) => {
    if (selectedInfluencers.includes(id)) {
      setSelectedInfluencers(selectedInfluencers.filter(i => i !== id));
    } else {
      setSelectedInfluencers([...selectedInfluencers, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/brand/dashboard');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-foreground">Create Campaign</h2>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Details */}
            <Card glass className="space-y-4">
              <h3 className="text-foreground">Campaign Details</h3>
              <Input
                label="Campaign Title"
                placeholder="Summer Collection Launch"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <Input
                label="Budget (USD)"
                type="number"
                placeholder="5000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                required
              />
              <Select
                label="Deliverable Type"
                options={deliverables}
                value={formData.deliverable}
                onChange={(e) => setFormData({ ...formData, deliverable: e.target.value })}
              />
              <Input
                label="Timeline"
                type="date"
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                required
              />
              <div className="flex flex-col gap-2">
                <label className="text-sm text-muted-foreground">Campaign Description</label>
                <textarea
                  placeholder="Describe your campaign goals, target audience, key messaging..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20 min-h-[120px] resize-none"
                  required
                />
              </div>
            </Card>

            {/* Select Influencers */}
            <Card glass>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Select Influencers</h3>
                <span className="text-sm text-muted-foreground">
                  {selectedInfluencers.length} selected
                </span>
              </div>

              {selectedInfluencers.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedInfluencers.map(id => {
                    const inf = availableInfluencers.find(i => i.id === id);
                    return inf ? (
                      <div
                        key={id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full"
                      >
                        <img src={inf.image} alt={inf.name} className="w-5 h-5 rounded-full" />
                        <span className="text-sm text-foreground">{inf.name}</span>
                        <button
                          type="button"
                          onClick={() => toggleInfluencer(id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              <div className="space-y-2">
                {availableInfluencers.map(inf => (
                  <button
                    key={inf.id}
                    type="button"
                    onClick={() => toggleInfluencer(inf.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      selectedInfluencers.includes(inf.id)
                        ? 'bg-white/10 border-white/20'
                        : 'bg-secondary border-border hover:bg-white/5'
                    }`}
                  >
                    <img src={inf.image} alt={inf.name} className="w-10 h-10 rounded-full" />
                    <span className="text-foreground">{inf.name}</span>
                    {selectedInfluencers.includes(inf.id) && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <Plus className="w-3 h-3 text-black rotate-45" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </Card>

            {/* Budget Breakdown */}
            {selectedInfluencers.length > 0 && (
              <Card glass>
                <h3 className="text-foreground mb-3">Budget Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Influencer Payments</span>
                    <span>${formData.budget || '0'}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Platform Fee (10%)</span>
                    <span>${formData.budget ? (parseFloat(formData.budget) * 0.1).toFixed(0) : '0'}</span>
                  </div>
                  <div className="h-px bg-border my-2"></div>
                  <div className="flex justify-between text-foreground">
                    <span>Total</span>
                    <span>${formData.budget ? (parseFloat(formData.budget) * 1.1).toFixed(0) : '0'}</span>
                  </div>
                </div>
              </Card>
            )}

            <Button type="submit" className="w-full">
              Create Campaign
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
