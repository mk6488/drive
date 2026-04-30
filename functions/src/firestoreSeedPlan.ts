import type { FirestoreSeedData, FirestoreSeedRecord, FirestoreSeedSubmissionStatus } from './firestoreSeedData';

export type FirestoreSeedOperationType = 'planDocument';

export type FirestoreSeedDocumentType = FirestoreSeedRecord<Record<string, unknown>>['documentType'];

export interface FirestoreSeedOperation {
  readonly operationType: FirestoreSeedOperationType;
  readonly documentType: FirestoreSeedDocumentType;
  readonly documentId: string;
  readonly path: string;
  readonly data: Record<string, unknown>;
  readonly safetyNotes: readonly string[];
}

export interface FirestoreSeedPlan {
  readonly operations: readonly FirestoreSeedOperation[];
  readonly safetyWarnings: readonly string[];
  readonly noFirestoreWrites: true;
  readonly noFirestoreReads: true;
  readonly firebaseAdminInitialised: false;
}

export interface FirestoreSeedValidationResult {
  readonly status: 'valid' | 'blocked';
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

export interface FirestoreSeedPlanSummary {
  readonly totalOperations: number;
  readonly documentTypes: readonly FirestoreSeedDocumentType[];
  readonly paths: readonly string[];
  readonly safetyWarnings: readonly string[];
}

const allowedSubmissionStatuses: readonly FirestoreSeedSubmissionStatus[] = ['draft', 'submitted', 'verified', 'rejected'];
const forbiddenFieldNames = new Set(['pending', 'verifiedByCoachId', 'verifiedAt', 'coachNotes', 'rejectionReason']);

function clubPath(clubId: string): string {
  return `clubs/${clubId}`;
}

function squadPath(clubId: string, squadId: string): string {
  return `${clubPath(clubId)}/squads/${squadId}`;
}

function athletePath(clubId: string, athleteId: string): string {
  return `${clubPath(clubId)}/athletes/${athleteId}`;
}

function questPath(clubId: string, questId: string): string {
  return `${clubPath(clubId)}/quests/${questId}`;
}

function submissionPath(clubId: string, submissionId: string): string {
  return `${clubPath(clubId)}/submissions/${submissionId}`;
}

function athleteProgressPath(clubId: string, athleteId: string): string {
  return `${clubPath(clubId)}/athleteProgress/${athleteId}`;
}

function squadProgressPath(clubId: string, squadId: string): string {
  return `${clubPath(clubId)}/squadProgress/${squadId}`;
}

function rewardResultPath(clubId: string, rewardResultId: string): string {
  return `${clubPath(clubId)}/rewardResults/${rewardResultId}`;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function buildOperation(
  record: FirestoreSeedRecord<Record<string, unknown>>,
  path: string,
  safetyNotes: readonly string[],
): FirestoreSeedOperation {
  return {
    operationType: 'planDocument',
    documentType: record.documentType,
    documentId: record.id,
    path,
    data: record.data,
    safetyNotes,
  };
}

function findForbiddenFieldNames(value: unknown): readonly string[] {
  if (Array.isArray(value)) {
    return [...new Set(value.flatMap(findForbiddenFieldNames))];
  }

  if (typeof value !== 'object' || value === null) {
    return [];
  }

  const matches = Object.entries(value).flatMap(([key, nestedValue]) => [
    ...(forbiddenFieldNames.has(key) ? [key] : []),
    ...findForbiddenFieldNames(nestedValue),
  ]);

  return [...new Set(matches)];
}

function getDuplicateValues(values: readonly string[]): readonly string[] {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

export function createFirestoreSeedPlan(seedData: FirestoreSeedData): FirestoreSeedPlan {
  const clubId = seedData.club.id;
  const squadId = seedData.squad.id;
  const athleteId = seedData.athlete.id;

  const rewardOperation = seedData.rewardResult
    ? [
        buildOperation(seedData.rewardResult, rewardResultPath(clubId, seedData.rewardResult.id), [
          'Optional fake reward preview only; it must reference a verified submission.',
        ]),
      ]
    : [];

  return {
    operations: [
      buildOperation(seedData.club, clubPath(clubId), ['Fake example club only; no real club private data.']),
      buildOperation(seedData.squad, squadPath(clubId, squadId), ['Matches the example-j15-squad test claim scope.']),
      buildOperation(seedData.athlete, athletePath(clubId, athleteId), [
        'Fake example athlete only; no real junior identity or parent details.',
      ]),
      buildOperation(seedData.quest, questPath(clubId, seedData.quest.id), [
        'Coach-created quest preview only; no quest write is performed.',
      ]),
      buildOperation(seedData.submission, submissionPath(clubId, seedData.submission.id), [
        'PM5 submission preview only; no Storage upload or submit action is implemented.',
      ]),
      buildOperation(seedData.athleteProgress, athleteProgressPath(clubId, athleteId), [
        'Athlete progress preview only; no trusted progress write is performed.',
      ]),
      buildOperation(seedData.squadProgress, squadProgressPath(clubId, squadId), [
        'Squad progress preview only; no trusted squad progress write is performed.',
      ]),
      ...rewardOperation,
    ],
    safetyWarnings: [
      'Dry run only: no Firestore writes are performed.',
      'Dry run only: no Firestore reads are performed.',
      'Firebase Admin is not initialised by this seed plan.',
      'Use fake example data only; do not add real junior, parent, Firebase UID, or club-private data.',
      'Live seed application is deliberately not implemented.',
    ],
    noFirestoreWrites: true,
    noFirestoreReads: true,
    firebaseAdminInitialised: false,
  };
}

export function validateFirestoreSeedPlan(plan: FirestoreSeedPlan): FirestoreSeedValidationResult {
  const paths = plan.operations.map((operation) => operation.path);
  const duplicatePaths = getDuplicateValues(paths);
  const errors = [
    ...duplicatePaths.map((path) => `Duplicate planned document path: ${path}`),
    ...plan.operations.flatMap((operation) =>
      operation.documentId.trim().length === 0 ? [`Missing document id for ${operation.documentType}.`] : [],
    ),
    ...plan.operations.flatMap((operation) =>
      operation.path.trim().length === 0 ? [`Missing document path for ${operation.documentType}.`] : [],
    ),
    ...plan.operations.flatMap((operation) => {
      if (operation.documentType !== 'submission') {
        return [];
      }

      const status = operation.data.status;

      return typeof status === 'string' && allowedSubmissionStatuses.includes(status as FirestoreSeedSubmissionStatus)
        ? []
        : [`Submission ${operation.documentId} has invalid status: ${String(status)}.`];
    }),
    ...plan.operations.flatMap((operation) =>
      findForbiddenFieldNames(operation.data).map(
        (fieldName) => `${operation.documentType} ${operation.documentId} uses forbidden field name: ${fieldName}.`,
      ),
    ),
    ...plan.operations.flatMap((operation) =>
      asString(operation.data.clubId) && !operation.path.startsWith(`clubs/${asString(operation.data.clubId)}`)
        ? [`${operation.documentType} ${operation.documentId} path does not match its clubId.`]
        : [],
    ),
  ];

  const warnings = [
    ...plan.safetyWarnings,
    ...(plan.operations.some((operation) => operation.documentType === 'rewardResult')
      ? ['Reward result preview is present; verify it references a verified submission before any future live seed step.']
      : ['No reward result preview is planned because the example submission is not verified.']),
  ];

  return {
    status: errors.length === 0 ? 'valid' : 'blocked',
    errors,
    warnings,
  };
}

export function getFirestoreSeedPlanSummary(plan: FirestoreSeedPlan): FirestoreSeedPlanSummary {
  return {
    totalOperations: plan.operations.length,
    documentTypes: [...new Set(plan.operations.map((operation) => operation.documentType))],
    paths: plan.operations.map((operation) => operation.path),
    safetyWarnings: plan.safetyWarnings,
  };
}
