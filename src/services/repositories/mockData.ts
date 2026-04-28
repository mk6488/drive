import type { Athlete, AthleteProgress, Quest, Squad, Submission } from '@/src/types';

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
    squadId: mockSquad.id,
    missionTitle: 'January Consistency Block',
    current: 2,
    target: 20,
    updatedAt: nowIso,
  },
  updatedAt: nowIso,
};
