import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';

export function BrandDashboardPage() {
  usePageTitle('Brand dashboard');

  return (
    <div className="flex min-h-full flex-col justify-center">
      <Card className="p-8 text-center">
        <p className="text-xl font-semibold tracking-[-0.03em] text-neutral-950">
          Brand dashboard coming soon
        </p>
      </Card>
    </div>
  );
}
