import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button';
import { BackButton } from '../../components/FintechPrimitives';
import { Input } from '../../components/Input';
import { TopBar } from '../../components/TopBar';
import { useCampaign } from '../../context/CampaignContext';
import {
  campaignBudgetPresets,
  getCampaignBudgetPreset,
  isCampaignBudgetBelowMinimum,
  MIN_CAMPAIGN_BUDGET,
} from '../../utils/campaignBudget';
import { inr } from '../../utils/money';

export function BrandBudgetPage() {
  const navigate = useNavigate();
  const { budget, budgetPresetId, setBudget, setBudgetPreset } = useCampaign();
  const [picked, setPicked] = useState<typeof budgetPresetId | 'custom'>(
    budgetPresetId ?? 'custom',
  );
  const [customBudget, setCustomBudget] = useState(
    budgetPresetId ? '' : String(budget),
  );

  const parsedCustomBudget = Number.parseInt(customBudget || '0', 10) || 0;
  const selectedPreset =
    picked && picked !== 'custom' ? getCampaignBudgetPreset(picked) : null;
  const customBudgetError =
    picked === 'custom' && isCampaignBudgetBelowMinimum(parsedCustomBudget)
      ? `Minimum campaign budget is ${inr(MIN_CAMPAIGN_BUDGET)}`
      : '';
  const canContinue =
    selectedPreset !== null ||
    (picked === 'custom' && parsedCustomBudget >= MIN_CAMPAIGN_BUDGET);

  const handleNext = () => {
    if (!canContinue) return;

    if (selectedPreset) {
      setBudgetPreset(selectedPreset.id);
    } else {
      setBudget(parsedCustomBudget);
    }

    navigate('/brand/campaign');
  };

  return (
    <div className="fin-page">
      <TopBar
        left={<BackButton onClick={() => navigate('/brand/home')} />}
        title="Budget"
        subtitle="Choose your campaign budget."
      />

      <div className="space-y-3">
        {campaignBudgetPresets.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setPicked(option.id);
              setCustomBudget('');
            }}
            className={`w-full rounded-[24px] border p-4 text-left ${
              picked === option.id
                ? 'border-lime-200/50 bg-lime-200/10'
                : 'border-white/10 bg-gray-800'
            }`}
          >
            <div className="text-sm font-medium text-white">{option.label}</div>
            <div className="mt-1 text-xs text-zinc-400">{option.accent}</div>
          </button>
        ))}
      </div>

      <div
        className={`rounded-[24px] border p-4 ${
          picked === 'custom'
            ? 'border-lime-200/50 bg-lime-200/10'
            : 'border-white/10 bg-gray-800'
        }`}
      >
        <Input
          label="Custom budget"
          inputMode="numeric"
          value={customBudget}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '');
            setPicked('custom');
            setCustomBudget(digits);
          }}
          placeholder="15000"
        />
        {customBudgetError ? (
          <div className="mt-2 text-xs text-rose-300">{customBudgetError}</div>
        ) : null}
      </div>

      <div className="mt-auto">
        <Button fullWidth onClick={handleNext} disabled={!canContinue}>
          Next
        </Button>
      </div>
    </div>
  );
}
