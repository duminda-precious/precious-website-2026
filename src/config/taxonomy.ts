/**
 * Situation taxonomy. The same three starting points label case studies
 * (Work tags) and the Approach gate cards, so they share one source.
 */
export const situations = ['extend-my-team', 'redesign', 'build-from-zero'] as const;

export type Situation = (typeof situations)[number];

export const situationLabels: Record<Situation, string> = {
  'extend-my-team': 'Extend my team',
  redesign: 'Redesign',
  'build-from-zero': 'Build from zero',
};
