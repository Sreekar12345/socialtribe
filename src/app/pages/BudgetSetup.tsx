import { useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BackButton, ScreenHeader } from '../components/FintechPrimitives';
import { useCampaign } from '../context/CampaignContext';
import {
  campaignBudgetPresets,
  getCampaignBudgetPreset,
  isCampaignBudgetBelowMinimum,
  MIN_CAMPAIGN_BUDGET,
} from '../utils/campaignBudget';
import { inr } from '../utils/money';

export function BudgetSetup() {
  const navigate = useNavigate();
  const { budget, budgetPresetId, setBudget, setBudgetPreset } = useCampaign();
  const [picked, setPicked] = useState<typeof budgetPresetId | 'custom'>(
    budgetPresetId ?? 'custom',
  );
  const [custom, setCustom] = useState(budgetPresetId ? '' : String(budget));

  const customBudget = Number.parseInt(custom || '0', 10) || 0;
  const selectedPreset =
    picked && picked !== 'custom' ? getCampaignBudgetPreset(picked) : null;

  const activeBudget = useMemo(() => {
    if (selectedPreset) return selectedPreset.max ?? selectedPreset.min;
    return customBudget;
  }, [customBudget, selectedPreset]);

  const customBudgetError =
    picked === 'custom' && isCampaignBudgetBelowMinimum(customBudget)
      ? `Minimum campaign budget is ${inr(MIN_CAMPAIGN_BUDGET)}`
      : '';
  const canContinue =
    selectedPreset !== null ||
    (picked === 'custom' && customBudget >= MIN_CAMPAIGN_BUDGET);

  const submit = () => {
    if (!canContinue) return;

    if (selectedPreset) {
      setBudgetPreset(selectedPreset.id);
    } else {
      setBudget(customBudget);
    }

    navigate('/ai-plan');
  };

  return (
    <div className="fin-page">
      <BackButton onClick={() => navigate(-1)} />
      <ScreenHeader
        eyebrow="Campaign setup"
        title="Set the budget"
        subtitle="Pick the amount you want to deploy before we build a creator shortlist."
      />

      <div className="space-y-3">
        {campaignBudgetPresets.map((option) => {
          const active = picked === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setPicked(option.id);
                setCustom('');
              }}
              className={`w-full rounded-2xl border p-4 text-left ${
                active
                  ? 'border-lime-200/40 bg-lime-200/10 text-white'
                  : 'border-white/10 bg-gray-800 text-white'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-zinc-400">{option.accent}</span>
              </div>
            </button>
          );
        })}

        <div
          className={`rounded-2xl border p-4 ${
            picked === 'custom'
              ? 'border-lime-200/40 bg-lime-200/10'
              : 'border-white/10 bg-gray-800'
          }`}
        >
          <div className="fin-eyebrow">Custom amount</div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-zinc-400">
              {inr(0).replace(/[0-9,]/g, '')}
            </span>
            <input
              inputMode="numeric"
              value={custom}
              onChange={(event) => {
                setPicked('custom');
                setCustom(event.target.value.replace(/\D/g, ''));
              }}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
              placeholder="Enter campaign budget"
            />
          </div>
          {customBudgetError ? (
            <div className="mt-3 text-xs text-rose-300">{customBudgetError}</div>
          ) : null}
        </div>
      </div>

      <div className="fin-card">
        <div className="fin-eyebrow">What this funds</div>
        <div className="mt-3 text-sm leading-6 text-zinc-300">
          Your budget is used to shortlist creators, price deliverables, and lock
          escrow before the campaign goes live.
        </div>
        <div className="mt-3 text-xs text-zinc-500">
          Planning budget: {selectedPreset ? selectedPreset.label : inr(activeBudget)}
        </div>
      </div>

      <div className="fin-sticky-actions -mx-4">
        <button
          type="button"
          onClick={submit}
          disabled={!canContinue}
          className="fin-button-primary w-full"
        >
          <Sparkles className="h-4 w-4" /> Build shortlist{' '}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
