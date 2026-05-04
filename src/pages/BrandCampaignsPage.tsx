import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { brandPreviousCampaigns } from '../data/dashboardMockData';

export function BrandCampaignsPage() {
  usePageTitle('Campaigns');

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
          Campaigns
        </h1>
      </div>

      <div className="space-y-3">
        {brandPreviousCampaigns.map((campaign) => (
          <Card key={campaign.id} className="p-5">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-950">
                    {campaign.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">
                    {campaign.description}
                  </p>
                </div>
                <span className="rounded-full bg-[#f4ecd6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700">
                  {campaign.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
