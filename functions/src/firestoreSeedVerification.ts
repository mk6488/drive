import type { FirestoreSeedDocumentType, FirestoreSeedOperation, FirestoreSeedPlan } from './firestoreSeedPlan';

export type FirestoreSeedVerificationStatus = 'passed' | 'missing' | 'failed';

export interface FirestoreSeedVerificationCheck {
  readonly label: string;
  readonly path: string;
  readonly expectedDocumentType: FirestoreSeedDocumentType;
  readonly expectedDocumentId: string;
  readonly expectedOperationType: FirestoreSeedOperation['operationType'];
  readonly expectedClubId: 'example-club';
  readonly expectedSquadId?: 'example-j15-squad';
  readonly expectedAthleteId?: 'example-athlete';
}

export interface FirestoreSeedVerificationCheckResult extends FirestoreSeedVerificationCheck {
  readonly status: FirestoreSeedVerificationStatus;
  readonly exists: boolean;
  readonly messages: readonly string[];
}

export interface FirestoreSeedVerificationReport {
  readonly status: FirestoreSeedVerificationStatus;
  readonly checks: readonly FirestoreSeedVerificationCheckResult[];
  readonly summary: {
    readonly totalChecks: number;
    readonly passedChecks: number;
    readonly missingChecks: number;
    readonly failedChecks: number;
  };
  readonly noFirestoreWrites: true;
  readonly noFirestoreDeletes: true;
  readonly noRealJuniorData: true;
  readonly appRepositoryProviderUnchanged: true;
}

interface FirestoreSeedVerificationDocument {
  readonly exists: boolean;
  readonly data: Record<string, unknown> | null;
}

const requiredSeedDocumentTypes: readonly FirestoreSeedDocumentType[] = [
  'club',
  'squad',
  'athlete',
  'quest',
  'submission',
  'athleteProgress',
  'squadProgress',
];

function getCheckLabel(documentType: FirestoreSeedDocumentType) {
  switch (documentType) {
    case 'club':
      return 'club document exists';
    case 'squad':
      return 'squad document exists';
    case 'athlete':
      return 'athlete document exists';
    case 'quest':
      return 'quest document exists';
    case 'submission':
      return 'submission document exists';
    case 'athleteProgress':
      return 'athleteProgress document exists';
    case 'squadProgress':
      return 'squadProgress document exists';
    case 'rewardResult':
      return 'rewardResult document exists';
  }
}

function getExpectedSquadId(operation: FirestoreSeedOperation): 'example-j15-squad' | undefined {
  return operation.data.squadId === 'example-j15-squad' ? 'example-j15-squad' : undefined;
}

function getExpectedAthleteId(operation: FirestoreSeedOperation): 'example-athlete' | undefined {
  return operation.data.athleteId === 'example-athlete' ? 'example-athlete' : undefined;
}

function getExpectedPath(documentType: FirestoreSeedDocumentType, documentId: string) {
  switch (documentType) {
    case 'club':
      return 'clubs/example-club';
    case 'squad':
      return 'clubs/example-club/squads/example-j15-squad';
    case 'athlete':
      return 'clubs/example-club/athletes/example-athlete';
    case 'quest':
      return `clubs/example-club/quests/${documentId}`;
    case 'submission':
      return `clubs/example-club/submissions/${documentId}`;
    case 'athleteProgress':
      return 'clubs/example-club/athleteProgress/example-athlete';
    case 'squadProgress':
      return 'clubs/example-club/squadProgress/example-j15-squad';
    case 'rewardResult':
      return `clubs/example-club/rewardResults/${documentId}`;
  }
}

function hasExpectedDocumentId(check: FirestoreSeedVerificationCheck) {
  switch (check.expectedDocumentType) {
    case 'club':
      return check.expectedDocumentId === 'example-club';
    case 'squad':
    case 'squadProgress':
      return check.expectedDocumentId === 'example-j15-squad';
    case 'athlete':
    case 'athleteProgress':
      return check.expectedDocumentId === 'example-athlete';
    case 'quest':
    case 'submission':
    case 'rewardResult':
      return check.expectedDocumentId.trim().length > 0;
  }
}

function getDocumentTypeMarker(data: Record<string, unknown>) {
  return typeof data.documentType === 'string' ? data.documentType : null;
}

function createCheckMessages(
  check: FirestoreSeedVerificationCheck,
  document: FirestoreSeedVerificationDocument,
): readonly string[] {
  const messages: string[] = [];

  if (check.path !== getExpectedPath(check.expectedDocumentType, check.expectedDocumentId)) {
    messages.push(`Expected path mismatch for ${check.expectedDocumentType}: ${check.path}.`);
  }

  if (check.expectedOperationType !== 'planDocument') {
    messages.push(`Unexpected seed operation type for ${check.expectedDocumentType}: ${check.expectedOperationType}.`);
  }

  if (!hasExpectedDocumentId(check)) {
    messages.push(`Expected fake example id mismatch for ${check.expectedDocumentType}: ${check.expectedDocumentId}.`);
  }

  if (!document.exists || !document.data) {
    messages.push(`Missing expected fake seed document at ${check.path}.`);
    return messages;
  }

  const documentTypeMarker = getDocumentTypeMarker(document.data);

  if (documentTypeMarker && documentTypeMarker !== check.expectedDocumentType) {
    messages.push(
      `Document type marker mismatch at ${check.path}: expected ${check.expectedDocumentType}, found ${documentTypeMarker}.`,
    );
  }

  if (check.expectedDocumentType !== 'club' && document.data.clubId !== check.expectedClubId) {
    messages.push(`clubId mismatch at ${check.path}: expected ${check.expectedClubId}.`);
  }

  if (check.expectedSquadId && document.data.squadId !== check.expectedSquadId) {
    messages.push(`squadId mismatch at ${check.path}: expected ${check.expectedSquadId}.`);
  }

  if (check.expectedAthleteId && document.data.athleteId !== check.expectedAthleteId) {
    messages.push(`athleteId mismatch at ${check.path}: expected ${check.expectedAthleteId}.`);
  }

  return messages;
}

export function createExpectedSeedVerificationChecks(
  seedPlan: FirestoreSeedPlan,
): readonly FirestoreSeedVerificationCheck[] {
  return seedPlan.operations
    .filter((operation) => requiredSeedDocumentTypes.includes(operation.documentType))
    .map((operation) => ({
      label: getCheckLabel(operation.documentType),
      path: operation.path,
      expectedDocumentType: operation.documentType,
      expectedDocumentId: operation.documentId,
      expectedOperationType: operation.operationType,
      expectedClubId: 'example-club',
      expectedSquadId: getExpectedSquadId(operation),
      expectedAthleteId: getExpectedAthleteId(operation),
    }));
}

export function evaluateSeedVerificationCheck(
  check: FirestoreSeedVerificationCheck,
  document: FirestoreSeedVerificationDocument,
): FirestoreSeedVerificationCheckResult {
  const messages = createCheckMessages(check, document);
  const status: FirestoreSeedVerificationStatus = !document.exists ? 'missing' : messages.length === 0 ? 'passed' : 'failed';

  return {
    ...check,
    status,
    exists: document.exists,
    messages,
  };
}

export function createSeedVerificationReport(
  checks: readonly FirestoreSeedVerificationCheckResult[],
): FirestoreSeedVerificationReport {
  const missingChecks = checks.filter((check) => check.status === 'missing').length;
  const failedChecks = checks.filter((check) => check.status === 'failed').length;
  const passedChecks = checks.filter((check) => check.status === 'passed').length;
  const status: FirestoreSeedVerificationStatus =
    failedChecks > 0 ? 'failed' : missingChecks > 0 ? 'missing' : 'passed';

  return {
    status,
    checks,
    summary: {
      totalChecks: checks.length,
      passedChecks,
      missingChecks,
      failedChecks,
    },
    noFirestoreWrites: true,
    noFirestoreDeletes: true,
    noRealJuniorData: true,
    appRepositoryProviderUnchanged: true,
  };
}

export function summariseSeedVerificationReport(report: FirestoreSeedVerificationReport): readonly string[] {
  return [
    `Verification status: ${report.status}`,
    `Expected document checks: ${report.summary.totalChecks}`,
    `Passed checks: ${report.summary.passedChecks}`,
    `Missing checks: ${report.summary.missingChecks}`,
    `Failed checks: ${report.summary.failedChecks}`,
    'Safety result: no Firestore writes were performed.',
    'Safety result: no Firestore deletes were performed.',
    'Safety result: no real junior data is expected or used.',
    'Safety result: app repository provider remains unchanged and mock backed.',
  ];
}
