interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export function Card({ children, className = '', glass = false }: CardProps) {
  const glassClasses = glass
    ? 'bg-white/5 backdrop-blur-xl border border-white/10'
    : 'bg-secondary border border-border';

  return (
    <div className={`rounded-xl p-6 ${glassClasses} ${className}`}>
      {children}
    </div>
  );
}
