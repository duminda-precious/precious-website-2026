/** Aspect ratios MediaFrame accepts. Work grid positions use 3/2, 5/4, 1/1, 4/3 (brief §2.4). */
export const mediaAspects = ['3/2', '5/4', '1/1', '4/3', '16/9', '16/10', '4/5', '3/4'] as const;
export type MediaAspect = (typeof mediaAspects)[number];
