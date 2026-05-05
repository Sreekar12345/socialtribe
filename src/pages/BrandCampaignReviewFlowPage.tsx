import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  type CampaignInfluencer,
  recommendedInfluencers,
} from '../data/campaignFlowMockData';
import { useCampaignFlow } from '../context/CampaignFlowContext';
import {
  buildCampaignSchedule,
  formatDeliverableSummary,
  getCampaignDurationDays,
  type CampaignScheduleEntry,
  type ScheduleTimeWindow,
} from '../utils/campaignSchedule';

type ScheduleMode = 'AUTO' | 'ADJUST' | 'ADVANCED';

interface EditableScheduleEntry extends CampaignScheduleEntry {
  originalDay: number;
  scheduledDay: number;
  timeWindow: ScheduleTimeWindow;
  visitTime: string;
  shootWindow: string;
  postDeadlineDay: number;
}

const scheduleModes: Array<{
  id: ScheduleMode;
  title: string;
  description: string;
}> = [
  {
    id: 'AUTO',
    title: 'Auto',
    description: 'System-generated dates and time windows.',
  },
  {
    id: 'ADJUST',
    title: 'Adjust',
    description: 'Shift dates by up to 2 days and reorder creators.',
  },
  {
    id: 'ADVANCED',
    title: 'Advanced',
    description: 'Adds visit, shoot, and deadline guidance for niche campaigns.',
  },
];

const timeWindowOptions: ScheduleTimeWindow[] = [
  'Morning',
  'Afternoon',
  'Evening',
];

const visitTimeOptions = [
  'Before opening',
  'Lunch rush',
  'Golden hour',
  'Dinner rush',
] as const;

const shootWindowOptions = [
  'Same day capture',
  '1 day before post',
  '2 days before post',
  'Weekend batch shoot',
] as const;

function formatCampaignDate(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function formatScheduleDate(startDate: string, day: number) {
  const date = new Date(`${startDate}T00:00:00`);
  date.setDate(date.getDate() + day - 1);

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

function getAdjustableDayOptions(originalDay: number, durationDays: number) {
  const minimumDay = Math.max(1, originalDay - 2);
  const maximumDay = Math.min(durationDays, originalDay + 2);
  const options: number[] = [];

  for (let day = minimumDay; day <= maximumDay; day += 1) {
    options.push(day);
  }

  return options;
}

function getPostDeadlineOptions(scheduledDay: number, durationDays: number) {
  const maximumDay = Math.min(durationDays, scheduledDay + 3);
  const options: number[] = [];

  for (let day = scheduledDay; day <= maximumDay; day += 1) {
    options.push(day);
  }

  return options;
}

function clampPostDeadlineDay(scheduledDay: number, currentDeadlineDay: number, durationDays: number) {
  return Math.min(
    Math.max(currentDeadlineDay, scheduledDay),
    Math.min(durationDays, scheduledDay + 3),
  );
}

function createEditableSchedule(
  entries: CampaignScheduleEntry[],
  durationDays: number,
) {
  return entries.map((entry) => ({
    ...entry,
    originalDay: entry.day,
    scheduledDay: entry.day,
    timeWindow: entry.suggestedTimeWindow,
    visitTime: 'Lunch rush',
    shootWindow: '1 day before post',
    postDeadlineDay:
      durationDays > 0 ? Math.min(durationDays, entry.day + 1) : entry.day,
  }));
}

function supportsAdvancedScheduleMode(
  title: string,
  description: string,
  influencers: CampaignInfluencer[],
) {
  const campaignText = `${title} ${description}`.toLowerCase();
  const hospitalityKeywords = [
    'cafe',
    'cafes',
    'coffee',
    'restaurant',
    'restaurants',
    'dining',
    'menu',
    'tasting',
    'food',
  ];

  return (
    influencers.some((influencer) => influencer.category === 'Food') ||
    hospitalityKeywords.some((keyword) => campaignText.includes(keyword))
  );
}

export function BrandCampaignReviewFlowPage() {
  usePageTitle('Review Campaign');

  const navigate = useNavigate();
  const { draft } = useCampaignFlow();
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('AUTO');
  const [editableSchedule, setEditableSchedule] = useState<EditableScheduleEntry[]>([]);

  const selectedInfluencers = useMemo(
    () =>
      recommendedInfluencers.filter((influencer) =>
        draft.selectedInfluencerIds.includes(influencer.id),
      ),
    [draft.selectedInfluencerIds],
  );

  const deliverableSummary = formatDeliverableSummary(draft.deliverableCounts);
  const durationDays = getCampaignDurationDays(draft.startDate, draft.endDate);

  const schedule = useMemo(
    () =>
      buildCampaignSchedule({
        influencers: selectedInfluencers.map((influencer) => ({
          id: influencer.id,
          name: influencer.username,
          score: influencer.engagementRate,
        })),
        deliverableCounts: draft.deliverableCounts,
        durationDays,
      }),
    [draft.deliverableCounts, durationDays, selectedInfluencers],
  );

  const advancedScheduleEligible = useMemo(
    () =>
      supportsAdvancedScheduleMode(
        draft.title,
        draft.description,
        selectedInfluencers,
      ),
    [draft.description, draft.title, selectedInfluencers],
  );

  useEffect(() => {
    setEditableSchedule(createEditableSchedule(schedule.schedule, schedule.durationDays));
  }, [schedule.durationDays, schedule.schedule]);

  useEffect(() => {
    if (scheduleMode === 'ADVANCED' && !advancedScheduleEligible) {
      setScheduleMode('AUTO');
    }
  }, [advancedScheduleEligible, scheduleMode]);

  const modeDescription =
    scheduleMode === 'AUTO'
      ? 'The system balances pacing automatically and suggests broad windows instead of exact timestamps.'
      : scheduleMode === 'ADJUST'
        ? 'You can nudge dates within +/-2 days, change creator order, and choose Morning, Afternoon, or Evening.'
        : 'Advanced planning keeps system control, but adds visit time, shoot window, and a post deadline for hospitality-style campaigns.';

  function moveEditableEntry(index: number, direction: -1 | 1) {
    setEditableSchedule((current) => {
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [entry] = next.splice(index, 1);
      next.splice(nextIndex, 0, entry);
      return next;
    });
  }

  function updateEditableEntry(
    entryId: string,
    updater: (entry: EditableScheduleEntry) => EditableScheduleEntry,
  ) {
    setEditableSchedule((current) =>
      current.map((entry) => (entry.id === entryId ? updater(entry) : entry)),
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950">
        Review Campaign
      </h1>

      <Card className="p-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
            Campaign Summary
          </h2>
          <div className="rounded-[22px] bg-[#f4ecd6] px-4 py-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Title
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-950">
              {draft.title || 'Not provided'}
            </p>
          </div>
          <div className="rounded-[22px] bg-[#ede7fb] px-4 py-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Description
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-950">
              {draft.description || 'Not provided'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-[#eef5d8] px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Deliverables
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {deliverableSummary}
              </p>
            </div>
            <div className="rounded-[22px] bg-white px-4 py-3">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Campaign Duration
              </p>
              <p className="mt-2 text-sm font-semibold text-neutral-950">
                {draft.startDate && draft.endDate
                  ? `${formatCampaignDate(draft.startDate)} - ${formatCampaignDate(draft.endDate)}`
                  : 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                Distribution Schedule
              </h2>
              <p className="mt-1 text-sm leading-6 text-neutral-600">
                Smart scheduling keeps the system optimized while giving brands limited control.
              </p>
            </div>
            <span className="text-sm text-neutral-500">
              {schedule.totalDeliverables} tasks over {schedule.durationDays} days
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {scheduleModes.map((mode) => {
              const active = scheduleMode === mode.id;
              const disabled = mode.id === 'ADVANCED' && !advancedScheduleEligible;

              return (
                <button
                  key={mode.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setScheduleMode(mode.id)}
                  className={`rounded-[22px] border px-4 py-4 text-left transition ${
                    active
                      ? 'border-transparent bg-neutral-950 text-white'
                      : 'border-black/10 bg-[#f7f7f5] text-neutral-950'
                  } ${disabled ? 'cursor-not-allowed opacity-45' : ''}`}
                >
                  <p className="text-sm font-semibold">{mode.title}</p>
                  <p
                    className={`mt-1 text-sm leading-6 ${
                      active ? 'text-white/78' : 'text-neutral-600'
                    }`}
                  >
                    {mode.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="rounded-[22px] bg-[#f7f7f5] px-4 py-3">
            <p className="text-sm leading-6 text-neutral-600">{modeDescription}</p>
            {!advancedScheduleEligible ? (
              <p className="mt-1 text-xs text-neutral-500">
                Advanced opens for cafe and restaurant style campaigns.
              </p>
            ) : null}
          </div>

          {scheduleMode === 'AUTO' ? (
            schedule.schedule.length > 0 ? (
              <div className="space-y-3">
                {schedule.schedule.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="rounded-[22px] bg-[#f7f7f5] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-neutral-950">
                          Day {entry.day} -{' '}
                          {draft.startDate
                            ? formatScheduleDate(draft.startDate, entry.day)
                            : `Slot ${index + 1}`}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {entry.influencer}
                        </p>
                        <p className="text-sm text-neutral-600">
                          Suggested window: {entry.suggestedTimeWindow}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        {entry.content}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-600">
                Add deliverables, dates, and influencers to generate a schedule.
              </p>
            )
          ) : editableSchedule.length > 0 ? (
            <div className="space-y-3">
              {editableSchedule.map((entry, index) => (
                <div
                  key={entry.id}
                  className="rounded-[22px] border border-black/10 bg-white px-4 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-neutral-950">
                        Slot {index + 1}
                      </p>
                      <p className="text-sm text-neutral-600">{entry.influencer}</p>
                      <p className="text-sm text-neutral-600">{entry.content}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => moveEditableEntry(index, -1)}
                        disabled={index === 0}
                        className="rounded-full border border-black/10 px-3 py-2 text-xs font-medium text-neutral-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Move Earlier
                      </button>
                      <button
                        type="button"
                        onClick={() => moveEditableEntry(index, 1)}
                        disabled={index === editableSchedule.length - 1}
                        className="rounded-full border border-black/10 px-3 py-2 text-xs font-medium text-neutral-700 transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Move Later
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Post Date
                      </span>
                      <select
                        value={entry.scheduledDay}
                        onChange={(event) => {
                          const scheduledDay = Number.parseInt(event.target.value, 10);

                          updateEditableEntry(entry.id, (current) => ({
                            ...current,
                            scheduledDay,
                            postDeadlineDay: clampPostDeadlineDay(
                              scheduledDay,
                              current.postDeadlineDay,
                              schedule.durationDays,
                            ),
                          }));
                        }}
                        className="w-full rounded-[18px] border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm text-neutral-950 outline-none"
                      >
                        {getAdjustableDayOptions(entry.originalDay, schedule.durationDays).map((day) => (
                          <option key={day} value={day}>
                            Day {day}
                            {draft.startDate
                              ? ` - ${formatScheduleDate(draft.startDate, day)}`
                              : ''}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="space-y-2">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                        Time Window
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {timeWindowOptions.map((window) => {
                          const active = entry.timeWindow === window;

                          return (
                            <button
                              key={window}
                              type="button"
                              onClick={() =>
                                updateEditableEntry(entry.id, (current) => ({
                                  ...current,
                                  timeWindow: window,
                                }))
                              }
                              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                active
                                  ? 'bg-neutral-950 text-white'
                                  : 'border border-black/10 bg-[#f7f7f5] text-neutral-700'
                              }`}
                            >
                              {window}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {scheduleMode === 'ADVANCED' && advancedScheduleEligible ? (
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      <label className="space-y-2">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                          Visit Time
                        </span>
                        <select
                          value={entry.visitTime}
                          onChange={(event) =>
                            updateEditableEntry(entry.id, (current) => ({
                              ...current,
                              visitTime: event.target.value,
                            }))
                          }
                          className="w-full rounded-[18px] border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm text-neutral-950 outline-none"
                        >
                          {visitTimeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                          Shoot Window
                        </span>
                        <select
                          value={entry.shootWindow}
                          onChange={(event) =>
                            updateEditableEntry(entry.id, (current) => ({
                              ...current,
                              shootWindow: event.target.value,
                            }))
                          }
                          className="w-full rounded-[18px] border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm text-neutral-950 outline-none"
                        >
                          {shootWindowOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="space-y-2">
                        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                          Post Deadline
                        </span>
                        <select
                          value={entry.postDeadlineDay}
                          onChange={(event) =>
                            updateEditableEntry(entry.id, (current) => ({
                              ...current,
                              postDeadlineDay: Number.parseInt(event.target.value, 10),
                            }))
                          }
                          className="w-full rounded-[18px] border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm text-neutral-950 outline-none"
                        >
                          {getPostDeadlineOptions(
                            entry.scheduledDay,
                            schedule.durationDays,
                          ).map((day) => (
                            <option key={day} value={day}>
                              Day {day}
                              {draft.startDate
                                ? ` - ${formatScheduleDate(draft.startDate, day)}`
                                : ''}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ) : null}

                  <p className="mt-4 text-xs text-neutral-500">
                    Exact times stay system-managed. Adjustments remain limited to date range, order, and broad time windows.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600">
              Add deliverables, dates, and influencers to generate a schedule.
            </p>
          )}

          {schedule.warnings.map((warning) => (
            <p key={warning} className="text-sm text-[#b42318]">
              {warning}
            </p>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
            Selected Influencers
          </h2>
          {selectedInfluencers.length > 0 ? (
            selectedInfluencers.map((influencer) => (
              <div
                key={influencer.id}
                className="rounded-[22px] bg-[#f7f7f5] px-4 py-3"
              >
                <p className="text-sm font-semibold text-neutral-950">
                  {influencer.username}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {influencer.category}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-neutral-600">No influencers selected.</p>
          )}
        </div>
      </Card>

      <Button fullWidth onClick={() => navigate('/brand/payment')}>
        Proceed to Payment
      </Button>
    </div>
  );
}
