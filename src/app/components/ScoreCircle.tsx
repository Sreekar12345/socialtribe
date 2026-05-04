interface ScoreCircleProps {
  value: number;
}

export function ScoreCircle({ value }: ScoreCircleProps) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, value));
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[2.2rem] font-semibold tracking-[-0.05em] text-white">
          {Math.round(progress)}
        </div>
        <div className="fin-eyebrow mt-1">Score</div>
      </div>
    </div>
  );
}
