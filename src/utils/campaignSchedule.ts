export type ScheduleContentType = 'Reel' | 'Post' | 'Story';
export type ScheduleTimeWindow = 'Morning' | 'Afternoon' | 'Evening';

export interface CampaignDeliverableCounts {
  Reel: number;
  Post: number;
  Story: number;
}

export interface CampaignScheduleInfluencer {
  id: string;
  name: string;
  score: number;
}

export interface CampaignScheduleEntry {
  id: string;
  day: number;
  influencerId: string;
  influencer: string;
  content: ScheduleContentType;
  suggestedTimeWindow: ScheduleTimeWindow;
}

export interface CampaignScheduleResult {
  schedule: CampaignScheduleEntry[];
  totalDeliverables: number;
  durationDays: number;
  warnings: string[];
}

const contentTypeOrder: ScheduleContentType[] = ['Reel', 'Post', 'Story'];
const timeWindowOrder: ScheduleTimeWindow[] = ['Morning', 'Afternoon', 'Evening'];

export function createEmptyDeliverableCounts(): CampaignDeliverableCounts {
  return {
    Reel: 0,
    Post: 0,
    Story: 0,
  };
}

export function sanitizeDeliverableCounts(
  counts?: Partial<CampaignDeliverableCounts>,
) {
  const next = createEmptyDeliverableCounts();

  contentTypeOrder.forEach((type) => {
    const value = Number.parseInt(String(counts?.[type] ?? 0), 10);
    next[type] = Number.isFinite(value) && value > 0 ? value : 0;
  });

  return next;
}

export function getTotalDeliverables(counts: CampaignDeliverableCounts) {
  return contentTypeOrder.reduce((total, type) => total + counts[type], 0);
}

export function getCampaignDurationDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const difference = end.getTime() - start.getTime();

  if (difference < 0) {
    return 0;
  }

  return Math.floor(difference / (24 * 60 * 60 * 1000)) + 1;
}

export function formatDeliverableSummary(counts: CampaignDeliverableCounts) {
  const parts = contentTypeOrder
    .map((type) => ({ type, count: counts[type] }))
    .filter((item) => item.count > 0)
    .map((item) => {
      const suffix =
        item.count === 1
          ? item.type
          : item.type === 'Story'
            ? 'Stories'
            : `${item.type}s`;

      return `${item.count} ${suffix}`;
    });

  return parts.length > 0 ? parts.join(', ') : 'Not set';
}

function createEmptyTimeWindowCounts() {
  return timeWindowOrder.reduce(
    (counts, window) => {
      counts[window] = 0;
      return counts;
    },
    {} as Record<ScheduleTimeWindow, number>,
  );
}

function getTimeWindowPreferences(content: ScheduleContentType) {
  if (content === 'Story') {
    return ['Morning', 'Afternoon', 'Evening'] as const;
  }

  if (content === 'Post') {
    return ['Afternoon', 'Evening', 'Morning'] as const;
  }

  return ['Evening', 'Afternoon', 'Morning'] as const;
}

function chooseSuggestedTimeWindow(
  content: ScheduleContentType,
  dayWindowCounts: Record<ScheduleTimeWindow, number>,
  lastGlobalWindow: ScheduleTimeWindow | null,
) {
  const preferences = getTimeWindowPreferences(content);
  let pool = preferences.filter((window) => dayWindowCounts[window] === 0);

  if (pool.length === 0) {
    pool = [...preferences];
  }

  const nonRepeatingPool = pool.filter((window) => window !== lastGlobalWindow);

  return (nonRepeatingPool.length > 0 ? nonRepeatingPool : pool)[0];
}

function getQuotaByInfluencer(
  influencers: CampaignScheduleInfluencer[],
  totalDeliverables: number,
) {
  const quotas = new Map<string, number>();

  if (influencers.length === 0 || totalDeliverables === 0) {
    return quotas;
  }

  const ranked = [...influencers].sort((left, right) => right.score - left.score);
  const base = Math.floor(totalDeliverables / ranked.length);
  let remaining = totalDeliverables - base * ranked.length;

  ranked.forEach((influencer) => {
    quotas.set(influencer.id, base);
  });

  for (let index = 0; index < ranked.length && remaining > 0; index += 1) {
    const influencer = ranked[index];
    quotas.set(influencer.id, (quotas.get(influencer.id) ?? 0) + 1);
    remaining -= 1;
  }

  const minimumQuota = Math.max(0, base - 1);
  const topCandidates = ranked.slice(0, Math.min(2, ranked.length));

  topCandidates.forEach((influencer) => {
    while ((quotas.get(influencer.id) ?? 0) < base + 2) {
      const donor = [...ranked]
        .reverse()
        .find(
          (candidate) =>
            candidate.id !== influencer.id &&
            (quotas.get(candidate.id) ?? 0) > minimumQuota,
        );

      if (!donor || influencer.score <= donor.score) {
        break;
      }

      quotas.set(influencer.id, (quotas.get(influencer.id) ?? 0) + 1);
      quotas.set(donor.id, (quotas.get(donor.id) ?? 0) - 1);
    }
  });

  return quotas;
}

function allocateContentTargets(
  influencers: CampaignScheduleInfluencer[],
  quotas: Map<string, number>,
  deliverableCounts: CampaignDeliverableCounts,
  durationDays: number,
) {
  const remaining = { ...deliverableCounts };
  const states = influencers.map((influencer) => ({
    influencer,
    quota: quotas.get(influencer.id) ?? 0,
    assigned: 0,
    targets: createEmptyDeliverableCounts(),
    lastContent: null as ScheduleContentType | null,
  }));

  let lastGlobalContent: ScheduleContentType | null = null;

  while (getTotalDeliverables(remaining) > 0) {
    const availableStates = states
      .filter((state) => state.assigned < state.quota)
      .sort((left, right) => {
        const leftRemaining = left.quota - left.assigned;
        const rightRemaining = right.quota - right.assigned;

        if (rightRemaining !== leftRemaining) {
          return rightRemaining - leftRemaining;
        }

        if (right.influencer.score !== left.influencer.score) {
          return right.influencer.score - left.influencer.score;
        }

        return left.assigned - right.assigned;
      });

    const state = availableStates[0];

    if (!state) {
      break;
    }

    const availableContent = contentTypeOrder.filter((type) => remaining[type] > 0);
    const nonRepeatingContent = availableContent.filter(
      (type) => type !== state.lastContent,
    );
    const contentPool =
      nonRepeatingContent.length > 0 ? nonRepeatingContent : availableContent;

    const nextContent = [...contentPool].sort((left, right) => {
      const leftScore =
        remaining[left] * 10 +
        (state.targets[left] === 0 ? 2 : 0) +
        (left !== lastGlobalContent ? 1 : 0);
      const rightScore =
        remaining[right] * 10 +
        (state.targets[right] === 0 ? 2 : 0) +
        (right !== lastGlobalContent ? 1 : 0);

      return rightScore - leftScore;
    })[0];

    state.targets[nextContent] += 1;
    state.assigned += 1;
    state.lastContent = nextContent;
    remaining[nextContent] -= 1;
    lastGlobalContent = nextContent;
  }

  return states.map((state) => ({
    influencer: state.influencer,
    targets: state.targets,
    remainingTasks: getTotalDeliverables(state.targets),
    preferredGap:
      state.quota <= 1
        ? 1
        : state.quota * 3 <= durationDays
          ? 3
          : state.quota * 2 <= durationDays
            ? 2
            : 1,
    lastScheduledDay: null as number | null,
    lastScheduledContent: null as ScheduleContentType | null,
  }));
}

function chooseContentForSlot(
  remainingTargets: CampaignDeliverableCounts,
  lastScheduledContent: ScheduleContentType | null,
  lastGlobalContent: ScheduleContentType | null,
  weekCounts: CampaignDeliverableCounts,
  dayCounts: CampaignDeliverableCounts,
) {
  const available = contentTypeOrder.filter((type) => remainingTargets[type] > 0);

  if (available.length === 0) {
    return null;
  }

  let pool = available;

  const nonRepeatingForInfluencer = pool.filter(
    (type) => type !== lastScheduledContent,
  );

  if (nonRepeatingForInfluencer.length > 0) {
    pool = nonRepeatingForInfluencer;
  }

  const diverseFromGlobal = pool.filter((type) => type !== lastGlobalContent);

  if (diverseFromGlobal.length > 0) {
    pool = diverseFromGlobal;
  }

  if (dayCounts.Post >= 1) {
    const nonPostPool = pool.filter((type) => type !== 'Post');

    if (nonPostPool.length > 0) {
      pool = nonPostPool;
    }
  }

  return [...pool].sort((left, right) => {
    const leftScore =
      remainingTargets[left] * 10 - weekCounts[left] * 2 - dayCounts[left] * 4;
    const rightScore =
      remainingTargets[right] * 10 - weekCounts[right] * 2 - dayCounts[right] * 4;

    return rightScore - leftScore;
  })[0];
}

export function buildCampaignSchedule(input: {
  influencers: CampaignScheduleInfluencer[];
  deliverableCounts: CampaignDeliverableCounts;
  durationDays: number;
}) {
  const deliverableCounts = sanitizeDeliverableCounts(input.deliverableCounts);
  const totalDeliverables = getTotalDeliverables(deliverableCounts);
  const durationDays = Math.max(0, Math.trunc(input.durationDays));
  const warnings: string[] = [];

  if (input.influencers.length === 0 || totalDeliverables === 0 || durationDays === 0) {
    return {
      schedule: [],
      totalDeliverables,
      durationDays,
      warnings,
    } satisfies CampaignScheduleResult;
  }

  const dailyCap =
    totalDeliverables <= durationDays
      ? 1
      : totalDeliverables <= durationDays * 2
        ? 2
        : Math.ceil(totalDeliverables / durationDays);

  if (dailyCap > 2) {
    warnings.push(
      'Duration is tight, so some days need more than two deliverables to fit the campaign.',
    );
  }

  const quotas = getQuotaByInfluencer(input.influencers, totalDeliverables);
  const states = allocateContentTargets(
    input.influencers,
    quotas,
    deliverableCounts,
    durationDays,
  );
  const schedule: CampaignScheduleEntry[] = [];
  let remainingTasks = totalDeliverables;

  for (let day = 1; day <= durationDays && remainingTasks > 0; day += 1) {
    const remainingDays = durationDays - day + 1;
    const minimumToday = Math.max(
      0,
      remainingTasks - (remainingDays - 1) * dailyCap,
    );
    const idealToday = Math.ceil(remainingTasks / remainingDays);
    const slotsToday = Math.max(minimumToday, Math.min(dailyCap, idealToday));
    const weekCounts = createEmptyDeliverableCounts();
    const dayCounts = createEmptyDeliverableCounts();
    const dayWindowCounts = createEmptyTimeWindowCounts();

    schedule
      .filter(
        (entry) => entry.day >= day - ((day - 1) % 7) && entry.day <= day,
      )
      .forEach((entry) => {
        weekCounts[entry.content] += 1;
      });

    for (let slot = 0; slot < slotsToday && remainingTasks > 0; slot += 1) {
      const recentInfluencers = schedule.slice(-2).map((entry) => entry.influencerId);
      let selectedState:
        | (typeof states)[number]
        | undefined;

      const gapRelaxationLevels = [3, 2, 1, 0];

      for (const gapLimit of gapRelaxationLevels) {
        const eligibleStates = states
          .filter((state) => state.remainingTasks > 0)
          .filter((state) => {
            if (state.lastScheduledDay === null) {
              return true;
            }

            return day - state.lastScheduledDay >= Math.min(state.preferredGap, gapLimit);
          });

        const nonConsecutiveStates = eligibleStates.filter(
          (state) =>
            recentInfluencers.length < 2 ||
            recentInfluencers[0] !== recentInfluencers[1] ||
            recentInfluencers[1] !== state.influencer.id,
        );

        const candidatePool =
          nonConsecutiveStates.length > 0 ? nonConsecutiveStates : eligibleStates;

        if (candidatePool.length === 0) {
          continue;
        }

        selectedState = [...candidatePool].sort((left, right) => {
          if (right.remainingTasks !== left.remainingTasks) {
            return right.remainingTasks - left.remainingTasks;
          }

          if (left.lastScheduledDay === null || right.lastScheduledDay === null) {
            return left.lastScheduledDay === null ? -1 : 1;
          }

          if (left.lastScheduledDay !== right.lastScheduledDay) {
            return left.lastScheduledDay - right.lastScheduledDay;
          }

          return right.influencer.score - left.influencer.score;
        })[0];

        if (selectedState) {
          break;
        }
      }

      if (!selectedState) {
        selectedState = states.find((state) => state.remainingTasks > 0);
      }

      if (!selectedState) {
        break;
      }

      const lastGlobalContent =
        schedule.length > 0 ? schedule[schedule.length - 1].content : null;
      const nextContent =
        chooseContentForSlot(
          selectedState.targets,
          selectedState.lastScheduledContent,
          lastGlobalContent,
          weekCounts,
          dayCounts,
        ) ?? contentTypeOrder.find((type) => selectedState.targets[type] > 0);

      if (!nextContent) {
        break;
      }

      selectedState.targets[nextContent] -= 1;
      selectedState.remainingTasks -= 1;
      selectedState.lastScheduledContent = nextContent;
      selectedState.lastScheduledDay = day;
      remainingTasks -= 1;
      weekCounts[nextContent] += 1;
      dayCounts[nextContent] += 1;
      const suggestedTimeWindow = chooseSuggestedTimeWindow(
        nextContent,
        dayWindowCounts,
        schedule.length > 0 ? schedule[schedule.length - 1].suggestedTimeWindow : null,
      );
      dayWindowCounts[suggestedTimeWindow] += 1;

      schedule.push({
        id: `schedule-${day}-${slot + 1}-${selectedState.influencer.id}-${nextContent}`,
        day,
        influencerId: selectedState.influencer.id,
        influencer: selectedState.influencer.name,
        content: nextContent,
        suggestedTimeWindow,
      });
    }
  }

  if (remainingTasks > 0) {
    warnings.push(
      'Some deliverables could not be spaced ideally within the selected duration.',
    );
  }

  return {
    schedule,
    totalDeliverables,
    durationDays,
    warnings,
  } satisfies CampaignScheduleResult;
}
