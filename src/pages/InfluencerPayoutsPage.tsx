import { addDays, format, parseISO } from 'date-fns';
import { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  influencerEarningsOverview,
  influencerPayoutEntries,
  influencerPerformanceInsight,
} from '../data/dashboardMockData';

type PayoutEntry = (typeof influencerPayoutEntries)[number];
type PayoutFilter = 'All' | 'Completed' | 'Pending';
type PayoutStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'DELAYED';

const payoutTimingById: Record<
  PayoutEntry['id'],
  {
    submissionDate: string;
    payoutCycleDays: number;
  }
> = {
  'payout-1': {
    submissionDate: '2026-04-21',
    payoutCycleDays: 7,
  },
  'payout-2': {
    submissionDate: '2026-05-05',
    payoutCycleDays: 7,
  },
  'payout-3': {
    submissionDate: '2026-04-29',
    payoutCycleDays: 7,
  },
  'payout-4': {
    submissionDate: '2026-04-25',
    payoutCycleDays: 7,
  },
  'payout-5': {
    submissionDate: '2026-05-09',
    payoutCycleDays: 7,
  },
};

function normalizePayoutStatus(status: string): PayoutStatus {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'COMPLETED';
    case 'FAILED':
      return 'FAILED';
    case 'DELAYED':
      return 'DELAYED';
    default:
      return 'PENDING';
  }
}

function formatEstimatedPayoutDate(
  submissionDate: string,
  payoutCycleDays: number,
) {
  return format(addDays(parseISO(submissionDate), payoutCycleDays), 'd MMM yyyy');
}

function getPayoutStatusDetails(entry: PayoutEntry) {
  const status = normalizePayoutStatus(entry.status);

  switch (status) {
    case 'COMPLETED':
      return {
        badgeLabel: 'Completed',
        badgeClassName: 'bg-green-100 text-green-800',
        message: null,
        messageClassName: '',
      };
    case 'FAILED':
      return {
        badgeLabel: 'Failed',
        badgeClassName: 'bg-red-100 text-red-700',
        message: 'Payout failed \u2014 retrying',
        messageClassName: 'text-sm text-red-600',
      };
    case 'DELAYED':
      return {
        badgeLabel: 'Delayed',
        badgeClassName: 'bg-orange-100 text-orange-700',
        message: 'Delayed \u2014 processing',
        messageClassName: 'text-sm text-orange-700',
      };
    case 'PENDING': {
      const payoutTiming = payoutTimingById[entry.id];

      return {
        badgeLabel: 'Pending',
        badgeClassName: 'bg-amber-100 text-amber-800',
        message: `Estimated payout: ${formatEstimatedPayoutDate(payoutTiming.submissionDate, payoutTiming.payoutCycleDays)}`,
        messageClassName: 'text-sm text-neutral-600',
      };
    }
  }
}

export function InfluencerPayoutsPage() {
  usePageTitle('Payouts');

  const [filter, setFilter] = useState<PayoutFilter>('All');

  const visibleEntries = useMemo(() => {
    if (filter === 'All') {
      return influencerPayoutEntries;
    }

    if (filter === 'Completed') {
      return influencerPayoutEntries.filter(
        (entry) => normalizePayoutStatus(entry.status) === 'COMPLETED',
      );
    }

    return influencerPayoutEntries.filter((entry) =>
      ['PENDING', 'FAILED', 'DELAYED'].includes(
        normalizePayoutStatus(entry.status),
      ),
    );
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
          visibleEntries.map((entry) => {
            const statusDetails = getPayoutStatusDetails(entry);

            return (
              <Card key={entry.id} className="p-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium text-neutral-950">{entry.title}</p>
                    <p className="text-xs text-gray-500">
                      {entry.brandName} {'\u2022'} {entry.contentType}
                    </p>
                  </div>

                  {statusDetails.message ? (
                    <p className={statusDetails.messageClassName}>
                      {statusDetails.message}
                    </p>
                  ) : null}

                  <span
                    className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusDetails.badgeClassName}`}
                  >
                    {statusDetails.badgeLabel}
                  </span>
                </div>
              </Card>
            );
          })
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
