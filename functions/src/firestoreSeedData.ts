export type FirestoreSeedSubmissionStatus = 'draft' | 'submitted' | 'verified' | 'rejected';

export interface FirestoreSeedRecord<TDocument extends Record<string, unknown>> {
  readonly id: string;
  readonly documentType:
    | 'club'
    | 'squad'
    | 'athlete'
    | 'quest'
    | 'submission'
    | 'athleteProgress'
    | 'squadProgress'
    | 'rewardResult';
  readonly data: TDocument;
}

export interface FirestoreSeedData {
  readonly club: FirestoreSeedRecord<Record<string, unknown>>;
  readonly squad: FirestoreSeedRecord<Record<string, unknown>>;
  readonly athlete: FirestoreSeedRecord<Record<string, unknown>>;
  readonly quest: FirestoreSeedRecord<Record<string, unknown>>;
  readonly submission: FirestoreSeedRecord<Record<string, unknown> & { status: FirestoreSeedSubmissionStatus }>;
  readonly athleteProgress: FirestoreSeedRecord<Record<string, unknown>>;
  readonly squadProgress: FirestoreSeedRecord<Record<string, unknown>>;
  readonly rewardResult?: FirestoreSeedRecord<Record<string, unknown>>;
}

const nowIso = '2026-01-15T08:00:00.000Z';

export const firestoreSeedData: FirestoreSeedData = {
  club: {
    id: 'example-club',
    documentType: 'club',
    data: {
      name: 'Example Rowing Club',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  },
  squad: {
    id: 'example-j15-squad',
    documentType: 'squad',
    data: {
      clubId: 'example-club',
      name: 'Example J15 Squad',
      coachIds: ['example-coach-user'],
      athleteIds: ['example-athlete'],
      activeWinterQuestId: 'example-quest-rate-20',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  },
  athlete: {
    id: 'example-athlete',
    documentType: 'athlete',
    data: {
      clubId: 'example-club',
      squadId: 'example-j15-squad',
      displayName: 'Example Athlete',
      ageBand: 'u16',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  },
  quest: {
    id: 'example-quest-rate-20',
    documentType: 'quest',
    data: {
      clubId: 'example-club',
      squadId: 'example-j15-squad',
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
      createdByUserId: 'example-coach-user',
      createdByCoachId: 'example-coach-user',
      status: 'active',
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  },
  submission: {
    id: 'example-submission-rate-20',
    documentType: 'submission',
    data: {
      questId: 'example-quest-rate-20',
      clubId: 'example-club',
      squadId: 'example-j15-squad',
      athleteId: 'example-athlete',
      createdByUserId: 'example-athlete-user',
      pm5PhotoPath: 'clubs/example-club/submissions/example-submission-rate-20/pm5/example-pm5-photo.jpg',
      reflection: 'Held the rate cap for the first two blocks and reset my rhythm when the split drifted late.',
      status: 'submitted',
      submittedAt: '2026-01-16T18:45:00.000Z',
      createdAt: '2026-01-16T18:30:00.000Z',
      updatedAt: '2026-01-16T18:45:00.000Z',
    },
  },
  athleteProgress: {
    id: 'example-athlete',
    documentType: 'athleteProgress',
    data: {
      athleteId: 'example-athlete',
      clubId: 'example-club',
      squadId: 'example-j15-squad',
      xp: 120,
      level: 1,
      attributes: {
        Engine: 12,
        Discipline: 14,
        Rhythm: 13,
        Grit: 11,
      },
      badgeIds: [],
      riverMapPosition: 'rate-20-rapids-preview',
      boathouseContributions: {
        Energy: 18,
        Rhythm: 14,
      },
      updatedAt: nowIso,
    },
  },
  squadProgress: {
    id: 'example-j15-squad',
    documentType: 'squadProgress',
    data: {
      clubId: 'example-club',
      squadId: 'example-j15-squad',
      missionId: 'example-squad-mission-repair-quad',
      missionTitle: 'Repair the Club Quad',
      current: 15,
      target: 30,
      completedVerifiedSessions: 6,
      pacingDisciplineContributions: 4,
      rateControlContributions: 3,
      reflectionContributions: 2,
      squadContribution: 15,
      riverMapPosition: 'rate-20-rapids-preview',
      boathouseContributions: {
        Energy: 18,
        Rhythm: 14,
      },
      updatedAt: nowIso,
    },
  },
};
