import { Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { useCampaign } from '../../context/CampaignContext';
import { DELIVERABLE_OPTIONS, type DeliverableKey } from '../../utils/pricing';

const countFor = (items: DeliverableKey[], key: DeliverableKey) => items.filter((item) => item === key).length;

export function BrandCampaignBuilderPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { campaign, setCampaign } = useCampaign();

  const updateQuantity = (key: DeliverableKey, direction: 'up' | 'down') => {
    const currentCount = countFor(campaign.deliverables, key);
    if (direction === 'down' && currentCount === 0) return;

    if (direction === 'up') {
      setCampaign({ ...campaign, deliverables: [...campaign.deliverables, key] });
      return;
    }

    const next = [...campaign.deliverables];
    const index = next.lastIndexOf(key);
    next.splice(index, 1);
    setCampaign({ ...campaign, deliverables: next });
  };

  const canContinue = campaign.deliverables.length > 0 && campaign.deadline && campaign.brief.trim();

  return (
    <div className="fin-page">
      <TopBar left={<BackButton onClick={() => navigate('/brand/budget')} />} title="Campaign builder" subtitle="Set deliverables, deadline, and brief." />

      <div className="space-y-4 rounded-[24px] border border-white/10 bg-gray-800 p-4">
        <div className="space-y-3">
          <label className="fin-eyebrow">Deliverables</label>
          {DELIVERABLE_OPTIONS.map((entry) => (
            <div key={entry.value} className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3">
              <div className="text-sm text-white">{entry.label}</div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => updateQuantity(entry.value, 'down')} className="fin-topbar-action h-8 w-8">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-5 text-center text-sm text-white">{countFor(campaign.deliverables, entry.value)}</span>
                <button type="button" onClick={() => updateQuantity(entry.value, 'up')} className="fin-topbar-action h-8 w-8">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="fin-eyebrow">Deadline</label>
          <input
            type="date"
            value={campaign.deadline}
            onChange={(event) => setCampaign({ ...campaign, deadline: event.target.value })}
            className="fin-input"
          />
        </div>

        <div className="space-y-2">
          <label className="fin-eyebrow">Brief</label>
          <textarea
            value={campaign.brief}
            onChange={(event) =>
              setCampaign({
                ...campaign,
                brief: event.target.value,
                name: campaign.name || `${profile.brandName || 'Brand'} campaign`,
              })
            }
            rows={5}
            placeholder="Share campaign instructions, usage notes, and CTA requirements."
            className="fin-input resize-none"
          />
        </div>
      </div>

      <div className="mt-auto">
        <Button
          fullWidth
          onClick={() => {
            if (!campaign.name) {
              setCampaign({ ...campaign, name: `${profile.brandName || 'Brand'} campaign` });
            }
            navigate('/brand/match');
          }}
          disabled={!canContinue}
        >
          Find Creators
        </Button>
      </div>
    </div>
  );
}
