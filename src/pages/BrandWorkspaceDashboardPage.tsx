import { useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import { brandPreviousCampaigns } from '../data/dashboardMockData';

export function BrandWorkspaceDashboardPage() {
  usePageTitle('Brand dashboard');

  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Welcome back
      </p>

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
          Previous Campaigns
        </h1>

        {brandPreviousCampaigns.map((campaign) => (
          <button
            key={campaign.id}
            type="button"
            onClick={() => navigate('/brand/campaigns')}
            className="w-full text-left"
          >
            <Card className="p-5 transition-transform duration-200 hover:-translate-y-0.5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold text-neutral-950">
                    {campaign.title}
                  </h2>
                  <span className="rounded-full bg-[#eef5d8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700">
                    {campaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] bg-[#f4ecd6] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      Reach
                    </p>
                    <p className="mt-2 text-base font-semibold text-neutral-950">
                      {campaign.reach}
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-[#ede7fb] px-4 py-3">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                      Engagement
                    </p>
                    <p className="mt-2 text-base font-semibold text-neutral-950">
                      {campaign.engagement}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
