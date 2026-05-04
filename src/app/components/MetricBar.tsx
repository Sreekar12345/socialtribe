interface MetricBarProps {
  label: string;
  valueLabel: string;
  progress: number;
}

export function MetricBar({ label, valueLabel, progress }: MetricBarProps) {
  const width = Math.max(6, Math.min(100, progress));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-medium text-white">{valueLabel}</span>
      </div>
      <div className="fin-progress">
        <div className="fin-progress-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
