export function formatFollowers(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}
