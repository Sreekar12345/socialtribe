import { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  influencerEarningsOverview,
  influencerPayoutEntries,
  influencerPerformanceInsight,
} from '../data/dashboardMockData';

export function InfluencerPayoutsPage() {
  usePageTitle('Payouts');

  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');

  const visibleEntries = useMemo(() => {
    if (filter === 'All') {
      return influencerPayoutEntries;
    }

    return influencerPayoutEntries.filter((entry) => entry.status === filter);
  }, [filter]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Payouts
      </h1>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-neutral-950">
          Earnings Overview
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-4">
            <p className="text-xs text-gray-500">Total Earned</p>
            <p className="text-lg font-semibold text-neutral-950">
              {influencerEarningsOverview.totalEarned}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-xs text-gray-500">This Month</p>
            <p className="text-lg font-semibold text-neutral-950">
              {influencerEarningsOverview.thisMonth}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-xs text-gray-500">Completed Campaigns</p>
            <p className="text-lg font-semibold text-neutral-950">
              {influencerEarningsOverview.completedCampaigns}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4">
            <p className="text-xs text-gray-500">Pending Payments</p>
            <p className="text-lg font-semibold text-neutral-950">
              {influencerEarningsOverview.pendingPayments}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-lg font-semibold text-neutral-950">
          Performance Insight
        </h2>

        <div className="rounded-xl bg-white p-4 text-sm text-gray-600">
          {influencerPerformanceInsight}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {(['All', 'Completed', 'Pending'] as const).map((option) => {
          const active = filter === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'border-transparent bg-neutral-950 text-white'
                  : 'border-black/10 bg-white text-neutral-700'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {visibleEntries.length > 0 ? (
          visibleEntries.map((entry) => (
            <div key={entry.id} className="mb-3 rounded-xl bg-white p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium text-neutral-950">{entry.title}</p>
                <span className="rounded bg-green-100 px-2 py-1 text-xs text-neutral-700">
                  {entry.status.toUpperCase()}
                </span>
              </div>

              <p className="mb-2 text-xs text-gray-500">
                {entry.brandName} • {entry.contentType}
              </p>

              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Earned</span>
                <span className="font-medium text-neutral-950">
                  {entry.earned}
                </span>
              </div>
            </div>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-sm text-neutral-600">
              No payouts yet. Complete campaigns to start earning.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
