import type { BadgeDefinition, BadgeTier } from '@/src/types';

export type BadgeGroup = 'bronze' | 'silver' | 'gold' | 'secret';

export interface BadgeCatalogueGroup {
  group: BadgeGroup;
  title: string;
  badges: BadgeDefinition[];
}

function createBadgeId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function badge(name: string, tier: BadgeTier, description: string): BadgeDefinition {
  return {
    id: createBadgeId(name),
    name,
    tier,
    description,
  };
}

export const badgeCatalogue: readonly BadgeCatalogueGroup[] = [
  {
    group: 'bronze',
    title: 'Bronze',
    badges: [
      badge('First Screen Uploaded', 'bronze', 'First PM5 screen evidence submitted for coach review.'),
      badge('First Verified Session', 'bronze', 'First session marked verified by a coach.'),
      badge('3 Sessions Completed', 'bronze', 'Three verified sessions completed with honest evidence.'),
      badge('First Negative Split', 'bronze', 'First verified session with controlled negative split execution.'),
      badge('First Rate Cap Completed', 'bronze', 'First verified completion of a capped-rate quest.'),
      badge('First Coach Reflection', 'bronze', 'First useful reflection submitted for coach review.'),
    ],
  },
  {
    group: 'silver',
    title: 'Silver',
    badges: [
      badge('10 Verified Sessions', 'silver', 'Ten sessions verified by a coach.'),
      badge('4 Week Streak', 'silver', 'Four weeks of consistent verified training behaviour.'),
      badge('Rate 20 Mastery', 'silver', 'Verified quality control in rate-20 sessions.'),
      badge('Split Discipline', 'silver', 'Verified pacing discipline across session blocks.'),
      badge('Recovery Hero', 'silver', 'Verified recovery discipline between hard efforts.'),
      badge('Honest Upload', 'silver', 'Consistently honest PM5 evidence submissions.'),
    ],
  },
  {
    group: 'gold',
    title: 'Gold',
    badges: [
      badge('50 Verified Sessions', 'gold', 'Fifty coach-verified sessions completed.'),
      badge('100k Club', 'gold', 'Major verified winter training distance milestone.'),
      badge('250k Club', 'gold', 'Sustained verified training distance milestone.'),
      badge('500k Club', 'gold', 'Exceptional verified winter training distance milestone.'),
      badge('Perfect Week', 'gold', 'One week with complete verified execution quality.'),
      badge("Captain's Standard", 'gold', 'Consistent verified standards across pacing, rate, and reflection.'),
      badge('Winter Warrior', 'gold', 'Long-block commitment through winter verified sessions.'),
      badge('Pacing Surgeon', 'gold', 'Elite verified pacing discipline under coach-set targets.'),
      badge('Grit Badge', 'gold', 'Repeated honest effort and follow-through under pressure.'),
    ],
  },
  {
    group: 'secret',
    title: 'Secret or fun',
    badges: [
      badge('Comeback Session', 'secret', 'Quality verified return after a difficult patch.'),
      badge('Silent Grinder', 'secret', 'Consistent verified work with minimal noise.'),
      badge('The Metronome', 'secret', 'Exceptionally stable rhythm control across a session.'),
      badge('No Drama November', 'secret', 'Calm, disciplined month of verified execution.'),
      badge("Coach's Choice", 'secret', 'Coach-recognised behaviour that lifts training culture.'),
      badge('Big Dog Energy', 'secret', 'High-commitment verified effort with strong composure.'),
      badge('Tiny Rate Monster', 'secret', 'Strong output while respecting tight rate constraints.'),
      badge('Split Goblin Slayer', 'secret', 'Defeated split drift with disciplined pacing resets.'),
    ],
  },
];

export function listAllBadgeDefinitions(): BadgeDefinition[] {
  return badgeCatalogue.flatMap((group) => group.badges);
}
