import type {
  Athlete,
  AthleteProgress,
  AttributeName,
  Quest,
  RewardResult,
  Squad,
  SquadMissionProgress,
  Submission,
  SubmissionStatus,
} from '@/src/types';
import type {
  AthleteDocument,
  AthleteProgressDocument,
  FirestoreDateValue,
  QuestDocument,
  QuestDocumentDraft,
  RewardResultDocument,
  SquadDocument,
  SquadProgressDocument,
  SubmissionDocument,
  SubmissionDocumentDraft,
} from './firestoreDocuments';

// Pure Firestore document mapping helpers only.
// These helpers do not import Firebase, read Firestore, write Firestore, call repositories, or mutate inputs.
// Screens must not import these directly; future repositories may use them behind repository contracts.
// Reward and progress writes must remain trusted workflows after coach verification.

const attributeNames: readonly AttributeName[] = ['Engine', 'Discipline', 'Rhythm', 'Grit'];
const submissionStatuses: readonly SubmissionStatus[] = ['draft', 'submitted', 'verified', 'rejected'];

export function normaliseFirestoreDateValue(value: FirestoreDateValue): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return new Date(value).toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value.toDate().toISOString();
}

export function isSubmissionStatus(value: string): value is SubmissionStatus {
  return submissionStatuses.includes(value as SubmissionStatus);
}

function normaliseOptionalFirestoreDateValue(value: FirestoreDateValue | undefined): string | undefined {
  return value === undefined ? undefined : normaliseFirestoreDateValue(value);
}

function cloneStringArray(values: readonly string[]): string[] {
  return [...values];
}

function mapAttributeRecordToProgress(
  attributes: Partial<Record<AttributeName, number>>,
  updatedAt: string,
): AthleteProgress['attributes'] {
  return attributeNames.map((name) => ({
    name,
    value: attributes[name] ?? 0,
    updatedAt,
  }));
}

function mapBadgeIdsToProgress(badgeIds: readonly string[], unlockedAt: string): AthleteProgress['badges'] {
  return badgeIds.map((badgeId) => ({
    badgeId,
    unlockedAt,
  }));
}

export function mapAthleteDocumentToAthlete(id: string, data: AthleteDocument): Athlete {
  return {
    id,
    clubId: data.clubId,
    squadId: data.squadId,
    displayName: data.displayName,
    yearGroup: data.yearGroup,
    ageBand: data.ageBand,
    createdAt: normaliseFirestoreDateValue(data.createdAt),
    updatedAt: normaliseFirestoreDateValue(data.updatedAt),
  };
}

export function mapSquadDocumentToSquad(id: string, data: SquadDocument): Squad {
  return {
    id,
    clubId: data.clubId,
    name: data.name,
    coachIds: cloneStringArray(data.coachIds),
    athleteIds: cloneStringArray(data.athleteIds),
    createdAt: normaliseFirestoreDateValue(data.createdAt),
    updatedAt: normaliseFirestoreDateValue(data.updatedAt),
  };
}

export function mapQuestDocumentToQuest(id: string, data: QuestDocument): Quest {
  return {
    id,
    clubId: data.clubId,
    squadId: data.squadId,
    title: data.title,
    description: data.description,
    sessionType: data.sessionType,
    target: { ...data.target },
    executionFocus: [...data.executionFocus],
    availableFrom: normaliseFirestoreDateValue(data.availableFrom),
    dueAt: normaliseFirestoreDateValue(data.dueAt),
    createdByUserId: data.createdByUserId,
    createdAt: normaliseFirestoreDateValue(data.createdAt),
    updatedAt: normaliseFirestoreDateValue(data.updatedAt),
  };
}

export function mapSubmissionDocumentToSubmission(id: string, data: SubmissionDocument): Submission {
  return {
    id,
    questId: data.questId,
    athleteId: data.athleteId,
    clubId: data.clubId,
    squadId: data.squadId,
    pm5PhotoPath: data.pm5PhotoPath,
    reflection: data.reflection,
    status: data.status,
    submittedAt: normaliseOptionalFirestoreDateValue(data.submittedAt),
    reviewedByUserId: data.reviewedByUserId,
    reviewedAt: normaliseOptionalFirestoreDateValue(data.reviewedAt),
    coachNote: data.coachNote,
  };
}

export function mapRewardResultDocumentToRewardResult(id: string, data: RewardResultDocument): RewardResult {
  return {
    id,
    verifiedSubmissionId: data.verifiedSubmissionId,
    athleteId: data.athleteId,
    questId: data.questId,
    xpAwarded: data.xpAwarded,
    attributeDeltas: { ...data.attributeDeltas },
    unlockedBadgeIds: cloneStringArray(data.unlockedBadgeIds),
    createdAt: normaliseFirestoreDateValue(data.createdAt),
  };
}

export function mapAthleteProgressDocumentToAthleteProgress(
  id: string,
  data: AthleteProgressDocument,
): AthleteProgress {
  const updatedAt = normaliseFirestoreDateValue(data.updatedAt);

  return {
    athleteId: id || data.athleteId,
    clubId: data.clubId,
    squadId: data.squadId,
    totalXp: data.xp,
    level: data.level,
    attributes: mapAttributeRecordToProgress(data.attributes, updatedAt),
    badges: mapBadgeIdsToProgress(data.badgeIds, updatedAt),
    updatedAt,
  };
}

export function mapSquadProgressDocumentToSquadProgress(
  id: string,
  data: SquadProgressDocument,
): SquadMissionProgress {
  return {
    missionId: data.missionId,
    squadId: id || data.squadId,
    missionTitle: data.missionTitle,
    current: data.current,
    target: data.target,
    completedVerifiedSessions: data.completedVerifiedSessions,
    pacingDisciplineContributions: data.pacingDisciplineContributions,
    rateControlContributions: data.rateControlContributions,
    reflectionContributions: data.reflectionContributions,
    squadContribution: data.squadContribution,
    updatedAt: normaliseFirestoreDateValue(data.updatedAt),
  };
}

export function mapQuestDraftToQuestDocumentDraft(
  draft: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<Quest, 'createdAt' | 'updatedAt'>>,
): QuestDocumentDraft {
  return {
    clubId: draft.clubId,
    squadId: draft.squadId,
    title: draft.title,
    description: draft.description,
    sessionType: draft.sessionType,
    target: { ...draft.target },
    executionFocus: [...draft.executionFocus],
    availableFrom: draft.availableFrom,
    dueAt: draft.dueAt,
    createdByUserId: draft.createdByUserId,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
  };
}

export function mapSubmissionDraftToSubmissionDocumentDraft(
  draft: Omit<Submission, 'id'> & {
    createdByUserId?: string;
    createdAt?: string;
    updatedAt?: string;
  },
): SubmissionDocumentDraft {
  return {
    questId: draft.questId,
    clubId: draft.clubId,
    squadId: draft.squadId,
    athleteId: draft.athleteId,
    createdByUserId: draft.createdByUserId,
    pm5PhotoPath: draft.pm5PhotoPath,
    reflection: draft.reflection,
    status: draft.status,
    submittedAt: draft.submittedAt,
    reviewedByUserId: draft.reviewedByUserId,
    reviewedAt: draft.reviewedAt,
    coachNote: draft.coachNote,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
  };
}
