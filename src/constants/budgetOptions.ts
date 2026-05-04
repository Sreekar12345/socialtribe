export const budgetOptions = [
  { label: '15K \u2013 25K', min: 15000, max: 25000 },
  { label: '25K \u2013 40K', min: 25000, max: 40000 },
  { label: '40K \u2013 60K', min: 40000, max: 60000 },
  { label: '60K+', min: 60000, max: null },
] as const;

export type BudgetRange = (typeof budgetOptions)[number]['label'];

export function getBudgetRangeValue(range: string) {
  const option = budgetOptions.find((item) => item.label === range);

  if (!option) {
    return 0;
  }

  return option.max ?? option.min;
}
