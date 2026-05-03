export type DeliverableKey = 'story' | 'post' | 'reel';

export const WEIGHTS: Record<DeliverableKey, number> = {
  story: 0.5,
  post: 1,
  reel: 1.5,
};

export const DELIVERABLE_OPTIONS: Array<{ value: DeliverableKey; label: string }> = [
  { value: 'story', label: 'Story' },
  { value: 'post', label: 'Post' },
  { value: 'reel', label: 'Reel' },
];

const DELIVERABLE_LABELS: Record<DeliverableKey, string> = {
  story: 'Story',
  post: 'Post',
  reel: 'Reel',
};

const DELIVERABLE_PLURALS: Record<DeliverableKey, string> = {
  story: 'Stories',
  post: 'Posts',
  reel: 'Reels',
};

const DELIVERABLE_ORDER: DeliverableKey[] = ['story', 'post', 'reel'];

export function calculatePrice(basePrice: number, deliverables: DeliverableKey[]) {
  let multiplier = 0;

  deliverables.forEach((d) => {
    multiplier += WEIGHTS[d];
  });

  return Math.round(basePrice * multiplier);
}

export function formatDeliverablesSummary(deliverables: DeliverableKey[]) {
  const counts: Record<DeliverableKey, number> = {
    story: 0,
    post: 0,
    reel: 0,
  };

  deliverables.forEach((deliverable) => {
    counts[deliverable] += 1;
  });

  return DELIVERABLE_ORDER.filter((deliverable) => counts[deliverable] > 0)
    .map((deliverable) => {
      const count = counts[deliverable];
      const label = count === 1 ? DELIVERABLE_LABELS[deliverable] : DELIVERABLE_PLURALS[deliverable];
      return `${count} ${label}`;
    })
    .join(' + ');
}
