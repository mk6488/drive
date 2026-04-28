import type {
  Athlete,
  AthleteProgress,
  BoathouseProgress,
  Quest,
  RiverMapProgress,
  Squad,
  SquadMission,
  SquadMissionProgress,
  Submission,
} from '@/src/types';

export interface MockClub {
  id: string;
  name: string;
}

const nowIso = '2026-01-15T08:00:00.000Z';

export const mockClub: MockClub = {
  id: 'club-example-001',
  name: 'Example Rowing Club',
};

export const mockSquad: Squad = {
  id: 'squad-example-juniors',
  clubId: mockClub.id,
  name: 'Junior Winter Squad',
  coachIds: ['coach-example-001'],
  athleteIds: ['athlete-example-001'],
  createdAt: nowIso,
  updatedAt: nowIso,
};

export const mockAthlete: Athlete = {
  id: 'athlete-example-001',
  clubId: mockClub.id,
  squadId: mockSquad.id,
  displayName: 'Example Athlete',
  ageBand: 'u16',
  createdAt: nowIso,
  updatedAt: nowIso,
};

export const mockQuest: Quest = {
  id: 'quest-example-001',
  clubId: mockClub.id,
  squadId: mockSquad.id,
  title: 'Rate 20 Discipline Piece',
  description: '3 x 8 minutes with 2 minutes easy paddle. Hold form and controlled pressure.',
  sessionType: 'steady-state',
  target: {
    targetPace: '2:10-2:14',
    targetRate: 'r20',
    durationOrDistance: '3 x 8:00',
    notes: 'Prioritise clean rhythm and even pacing.',
  },
  executionFocus: ['pacing-discipline', 'rate-control', 'consistency', 'honest-effort'],
  availableFrom: '2026-01-15T05:00:00.000Z',
  dueAt: '2026-01-18T20:00:00.000Z',
  createdByUserId: 'coach-example-001',
  createdAt: nowIso,
  updatedAt: nowIso,
};

export const mockSubmission: Submission = {
  id: 'submission-example-001',
  questId: mockQuest.id,
  athleteId: mockAthlete.id,
  clubId: mockClub.id,
  squadId: mockSquad.id,
  pm5PhotoPath: 'mock/squads/squad-example-juniors/submissions/submission-example-001/pm5-photo.jpg',
  reflection: 'Held rate cap for first two blocks; drifted late and reset focus for the final block.',
  status: 'submitted',
  submittedAt: '2026-01-16T18:45:00.000Z',
};

export const mockAthleteProgress: AthleteProgress = {
  athleteId: mockAthlete.id,
  clubId: mockClub.id,
  squadId: mockSquad.id,
  totalXp: 120,
  level: 1,
  attributes: [
    { name: 'Engine', value: 12, updatedAt: nowIso },
    { name: 'Discipline', value: 14, updatedAt: nowIso },
    { name: 'Rhythm', value: 13, updatedAt: nowIso },
    { name: 'Grit', value: 11, updatedAt: nowIso },
  ],
  badges: [],
  squadMission: {
    missionId: 'squad-mission-preview-001',
    squadId: mockSquad.id,
    missionTitle: 'Repair the Club Quad',
    current: 15,
    target: 30,
    completedVerifiedSessions: 6,
    pacingDisciplineContributions: 4,
    rateControlContributions: 3,
    reflectionContributions: 2,
    squadContribution: 15,
    updatedAt: nowIso,
  },
  updatedAt: nowIso,
};

export const mockSquadMission: SquadMission = {
  id: 'squad-mission-preview-001',
  squadId: mockSquad.id,
  title: 'Repair the Club Quad',
  description:
    'The squad is restoring a winter training boat by banking verified sessions with controlled pacing, rate discipline, and useful reflections.',
  targets: [
    {
      id: 'mission-target-verified-sessions',
      label: 'Coach verified sessions',
      description: 'Sessions count only after coach review confirms the evidence and training intent.',
      contributionType: 'verified-sessions',
      current: 6,
      target: 12,
      unit: 'sessions',
    },
    {
      id: 'mission-target-pacing-discipline',
      label: 'Pacing discipline',
      description: 'Contributions come from holding the intended effort band, not chasing the fastest split.',
      contributionType: 'pacing-discipline',
      current: 4,
      target: 8,
      unit: 'quality marks',
    },
    {
      id: 'mission-target-rate-control',
      label: 'Rate control',
      description: 'Controlled rhythm and respecting rate caps help the boat move along the river.',
      contributionType: 'rate-control',
      current: 3,
      target: 6,
      unit: 'quality marks',
    },
    {
      id: 'mission-target-reflection',
      label: 'Useful reflections',
      description: 'Short, honest reflections help the coach see learning and consistency.',
      contributionType: 'reflection-quality',
      current: 2,
      target: 4,
      unit: 'reflections',
    },
  ],
  previewOnly: true,
  updatedAt: nowIso,
};

export const mockSquadMissionProgress: SquadMissionProgress = {
  missionId: mockSquadMission.id,
  squadId: mockSquad.id,
  missionTitle: mockSquadMission.title,
  current: 15,
  target: 30,
  completedVerifiedSessions: 6,
  pacingDisciplineContributions: 4,
  rateControlContributions: 3,
  reflectionContributions: 2,
  squadContribution: 15,
  updatedAt: nowIso,
};

export const mockRiverMapProgress: RiverMapProgress = {
  squadId: mockSquad.id,
  currentNodeId: 'rate-20-rapids',
  unlockedNodeIds: ['the-boathouse', 'winter-training-island', 'rate-20-rapids'],
  nodes: [
    {
      id: 'the-boathouse',
      title: 'The Boathouse',
      description: 'The squad gathers for the winter block and sets the standard for honest evidence.',
      order: 1,
      qualityFocus: 'Start line: private squad training evidence and coach oversight.',
    },
    {
      id: 'winter-training-island',
      title: 'Winter Training Island',
      description: 'Early verified sessions build shared momentum without public rankings.',
      order: 2,
      qualityFocus: 'Consistency and completed coach verified sessions.',
    },
    {
      id: 'rate-20-rapids',
      title: 'Rate 20 Rapids',
      description: 'Progress here comes from keeping rhythm when the session asks for restraint.',
      order: 3,
      qualityFocus: 'Rate control and pacing discipline.',
    },
    {
      id: 'the-pacing-marshes',
      title: 'The Pacing Marshes',
      description: 'The crew moves through when training shows patient, repeatable pacing.',
      order: 4,
      qualityFocus: 'Even effort and useful training reflections.',
    },
    {
      id: 'sprint-bridge',
      title: 'Sprint Bridge',
      description: 'A later landmark for controlled intent, not reckless speed chasing.',
      order: 5,
      qualityFocus: 'Coach verified quality under higher pressure.',
    },
    {
      id: 'regatta-harbour',
      title: 'Regatta Harbour',
      description: 'The destination represents squad identity built across the winter journey.',
      order: 6,
      qualityFocus: 'Shared contribution, honest effort, and verified execution.',
    },
  ],
  completedVerifiedSessions: 6,
  pacingDisciplineContributions: 4,
  rateControlContributions: 3,
  reflectionContributions: 2,
  squadContribution: 15,
  previewOnly: true,
  updatedAt: nowIso,
};

export const mockBoathouseProgress: BoathouseProgress = {
  squadId: mockSquad.id,
  title: 'Winter Boathouse Build',
  description:
    'A preview-only rowing world where future coach verified training quality could help the squad prepare the boathouse together.',
  resourceBalances: [
    {
      name: 'Energy',
      amount: 18,
      description: 'Preview reserve for completed training intent, not a live earned reward.',
      previewOnly: true,
    },
    {
      name: 'Grit',
      amount: 12,
      description: 'Preview reserve for persistence and honest reflection after hard sessions.',
      previewOnly: true,
    },
    {
      name: 'Rhythm',
      amount: 14,
      description: 'Preview reserve for controlled rate work and repeatable movement.',
      previewOnly: true,
    },
    {
      name: 'Power',
      amount: 9,
      description: 'Preview reserve for appropriate pressure without fastest-wins scoring.',
      previewOnly: true,
    },
    {
      name: 'Crew Points',
      amount: 21,
      description: 'Preview reserve for shared contribution and useful squad habits.',
      previewOnly: true,
    },
    {
      name: 'Repair Tokens',
      amount: 6,
      description: 'Preview reserve for future boathouse repair moments after verification.',
      previewOnly: true,
    },
  ],
  upgrades: [
    {
      id: 'boathouse-upgrade-erg-corner',
      name: 'Erg Corner',
      status: 'preview-ready',
      description: 'A tidy training corner for winter erg sessions and coach-set quality targets.',
      qualityUnlockExplanation: 'Future unlocks should come from verified session completion and controlled pacing.',
      resourceFocus: ['Energy', 'Rhythm'],
      previewOnly: true,
    },
    {
      id: 'boathouse-upgrade-blade-rack',
      name: 'Blade Rack',
      status: 'preview-building',
      description: 'A squad rack that represents shared rhythm, care, and repeatable habits.',
      qualityUnlockExplanation: 'Future progress should value rate control, consistency, and useful reflections.',
      resourceFocus: ['Rhythm', 'Crew Points'],
      previewOnly: true,
    },
    {
      id: 'boathouse-upgrade-repair-bench',
      name: 'Repair Bench',
      status: 'preview-building',
      description: 'A workbench for making the club kit feel cared for across the winter block.',
      qualityUnlockExplanation: 'Future progress should follow coach verified effort and honest training evidence.',
      resourceFocus: ['Repair Tokens', 'Grit'],
      previewOnly: true,
    },
    {
      id: 'boathouse-upgrade-crew-noticeboard',
      name: 'Crew Noticeboard',
      status: 'preview-ready',
      description: 'A private squad noticeboard for training focus, not public athlete profiles.',
      qualityUnlockExplanation: 'Future unlocks should recognise discipline, consistency, and coach-facing reflection.',
      resourceFocus: ['Crew Points', 'Grit'],
      previewOnly: true,
    },
    {
      id: 'boathouse-upgrade-trophy-shelf',
      name: 'Trophy Shelf',
      status: 'preview-locked',
      description: 'A quiet place for meaningful squad milestones, not fastest split bragging rights.',
      qualityUnlockExplanation: 'Future milestones must be verification gated and avoid public ranking pressure.',
      resourceFocus: ['Crew Points', 'Power'],
      previewOnly: true,
    },
    {
      id: 'boathouse-upgrade-regatta-prep-area',
      name: 'Regatta Prep Area',
      status: 'preview-locked',
      description: 'A later preview area for turning winter habits into calm race preparation.',
      qualityUnlockExplanation: 'Future progress should support quality under pressure, never training through exhaustion.',
      resourceFocus: ['Energy', 'Power', 'Rhythm'],
      previewOnly: true,
    },
  ],
  previewOnly: true,
  updatedAt: nowIso,
};
