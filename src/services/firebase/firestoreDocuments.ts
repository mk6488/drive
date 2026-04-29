import type {
  AgeBand,
  AttributeName,
  ExecutionFocus,
  QuestSessionType,
  QuestTarget,
  SubmissionStatus,
  YearGroup,
} from '@/src/types';

export type FirestoreDateValue = string | number | Date | { toDate: () => Date };

export interface ClubDocument {
  name: string;
  createdAt: FirestoreDateValue;
  updatedAt: FirestoreDateValue;
}

export interface SquadDocument {
  clubId: string;
  name: string;
  coachIds: string[];
  athleteIds: string[];
  activeWinterQuestId?: string;
  createdAt: FirestoreDateValue;
  updatedAt: FirestoreDateValue;
}

export interface AthleteDocument {
  clubId: string;
  squadId: string;
  displayName: string;
  yearGroup?: YearGroup;
  ageBand?: AgeBand;
  createdAt: FirestoreDateValue;
  updatedAt: FirestoreDateValue;
}

export interface QuestDocument {
  clubId: string;
  squadId: string;
  title: string;
  description: string;
  sessionType: QuestSessionType;
  target: QuestTarget;
  executionFocus: ExecutionFocus[];
  availableFrom: FirestoreDateValue;
  dueAt: FirestoreDateValue;
  createdByUserId: string;
  createdByCoachId?: string;
  status?: 'draft' | 'active' | 'archived';
  createdAt: FirestoreDateValue;
  updatedAt: FirestoreDateValue;
}

export interface SubmissionDocument {
  questId: string;
  clubId: string;
  squadId: string;
  athleteId: string;
  createdByUserId?: string;
  pm5PhotoPath: string;
  reflection: string;
  status: SubmissionStatus;
  submittedAt?: FirestoreDateValue;
  reviewedByUserId?: string;
  reviewedAt?: FirestoreDateValue;
  coachNote?: string;
  rewardResultId?: string;
  createdAt?: FirestoreDateValue;
  updatedAt?: FirestoreDateValue;
}

export interface RewardResultDocument {
  verifiedSubmissionId: string;
  clubId: string;
  squadId: string;
  questId: string;
  athleteId: string;
  xpAwarded: number;
  attributeDeltas: Partial<Record<AttributeName, number>>;
  unlockedBadgeIds: string[];
  squadMissionContribution?: number;
  riverMapDelta?: number;
  boathouseDelta?: number;
  explanation?: string;
  createdByUserId?: string;
  createdAt: FirestoreDateValue;
  updatedAt?: FirestoreDateValue;
}

export interface AthleteProgressDocument {
  athleteId: string;
  clubId: string;
  squadId: string;
  xp: number;
  level: number;
  attributes: Partial<Record<AttributeName, number>>;
  badgeIds: string[];
  riverMapPosition?: string;
  boathouseContributions?: Record<string, number>;
  updatedAt: FirestoreDateValue;
}

export interface SquadProgressDocument {
  clubId: string;
  squadId: string;
  missionId?: string;
  missionTitle: string;
  current: number;
  target: number;
  completedVerifiedSessions?: number;
  pacingDisciplineContributions?: number;
  rateControlContributions?: number;
  reflectionContributions?: number;
  squadContribution?: number;
  riverMapPosition?: string;
  boathouseContributions?: Record<string, number>;
  updatedAt: FirestoreDateValue;
}

export type QuestDocumentDraft = Omit<QuestDocument, 'createdAt' | 'updatedAt'> &
  Partial<Pick<QuestDocument, 'createdAt' | 'updatedAt'>>;

export type SubmissionDocumentDraft = Pick<
  SubmissionDocument,
  'questId' | 'clubId' | 'squadId' | 'athleteId' | 'pm5PhotoPath' | 'reflection' | 'status'
> &
  Partial<
    Pick<
      SubmissionDocument,
      | 'createdByUserId'
      | 'submittedAt'
      | 'reviewedByUserId'
      | 'reviewedAt'
      | 'coachNote'
      | 'rewardResultId'
      | 'createdAt'
      | 'updatedAt'
    >
  >;
