const INR_SYMBOL = '\u20B9';

export const MIN_CAMPAIGN_BUDGET = 15000;

export type CampaignBudgetPresetId =
  | '15k-25k'
  | '25k-40k'
  | '40k-60k'
  | '60k-plus';

export interface CampaignBudgetPreset {
  id: CampaignBudgetPresetId;
  label: string;
  min: number;
  max: number | null;
  accent: string;
}

export interface CampaignBudgetRange {
  min: number;
  max: number | null;
}

export interface CampaignBudgetStateValue {
  budget: number;
  budgetLabel: string;
  budgetMin: number;
  budgetMax: number | null;
  budgetPresetId: CampaignBudgetPresetId | null;
}

export const campaignBudgetPresets: CampaignBudgetPreset[] = [
  {
    id: '15k-25k',
    label: '15K - 25K',
    min: 15000,
    max: 25000,
    accent: 'Premium entry',
  },
  {
    id: '25k-40k',
    label: '25K - 40K',
    min: 25000,
    max: 40000,
    accent: 'Growth tier',
  },
  {
    id: '40k-60k',
    label: '40K - 60K',
    min: 40000,
    max: 60000,
    accent: 'Launch push',
  },
  {
    id: '60k-plus',
    label: '60K+',
    min: 60000,
    max: null,
    accent: 'Flagship',
  },
];

export function formatCampaignBudget(amount: number) {
  return `${INR_SYMBOL}${amount.toLocaleString('en-IN')}`;
}

export function getCampaignBudgetPreset(id: CampaignBudgetPresetId) {
  return (
    campaignBudgetPresets.find((preset) => preset.id === id) ??
    campaignBudgetPresets[0]
  );
}

export function buildPresetCampaignBudget(
  id: CampaignBudgetPresetId,
): CampaignBudgetStateValue {
  const preset = getCampaignBudgetPreset(id);

  return {
    budget: preset.max ?? preset.min,
    budgetLabel: preset.label,
    budgetMin: preset.min,
    budgetMax: preset.max,
    budgetPresetId: preset.id,
  };
}

export function buildCustomCampaignBudget(
  amount: number,
): CampaignBudgetStateValue {
  const safeAmount = Math.max(0, Math.trunc(amount));

  return {
    budget: safeAmount,
    budgetLabel: formatCampaignBudget(safeAmount),
    budgetMin: safeAmount,
    budgetMax: safeAmount,
    budgetPresetId: null,
  };
}

export function isCampaignBudgetBelowMinimum(amount: number) {
  return amount > 0 && amount < MIN_CAMPAIGN_BUDGET;
}

export function getCampaignBudgetLimit(max: number | null) {
  return max ?? Number.POSITIVE_INFINITY;
}
