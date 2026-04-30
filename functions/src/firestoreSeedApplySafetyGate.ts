import type { FirestoreSeedPlan, FirestoreSeedValidationResult } from './firestoreSeedPlan';

export const REQUIRED_FIRESTORE_SEED_APPLY_CONFIRMATION_PHRASE = 'APPLY_DRIVE_FIRESTORE_SEED';
export const REQUIRED_FIRESTORE_SEED_CLUB_ID = 'example-club';
export const REQUIRED_FIRESTORE_SEED_SQUAD_ID = 'example-j15-squad';
export const REQUIRED_FIRESTORE_SEED_ATHLETE_ID = 'example-athlete';

export type FirestoreSeedApplyMode = 'dryRun' | 'apply' | 'live';

export type FirestoreSeedApplyBlockReason =
  | 'invalidSeedPlan'
  | 'missingSeedPlan'
  | 'missingConfirmationPhrase'
  | 'confirmationPhraseMismatch'
  | 'missingRequestedApplyMode'
  | 'requestedApplyModeNotLive'
  | 'liveApplyEnvironmentNotEnabled'
  | 'missingEnvironmentName'
  | 'missingTrustedActorId'
  | 'missingAuditReason'
  | 'clubIdNotExampleOnly'
  | 'squadIdNotExampleOnly'
  | 'athleteIdNotExampleOnly'
  | 'realJuniorDataPresent'
  | 'serviceAccountFileRequiredInRepo';

export interface FirestoreSeedApplySafetyGateInput {
  readonly seedPlan: FirestoreSeedPlan | null;
  readonly validationResult: FirestoreSeedValidationResult | null;
  readonly confirmationPhrase: string | null;
  readonly requestedApplyMode: FirestoreSeedApplyMode | null;
  readonly environmentName: string | null;
  readonly trustedActorId: string | null;
  readonly auditReason: string | null;
  readonly liveApplyEnvironmentEnabled?: boolean;
  readonly realJuniorDataPresent?: boolean;
  readonly serviceAccountFileRequiredInRepo?: boolean;
}

export interface FirestoreSeedApplySafetyChecklist {
  readonly validationPassed: boolean;
  readonly hasSeedPlan: boolean;
  readonly hasConfirmationPhrase: boolean;
  readonly confirmationPhraseMatched: boolean;
  readonly requiredConfirmationPhrase: typeof REQUIRED_FIRESTORE_SEED_APPLY_CONFIRMATION_PHRASE;
  readonly hasRequestedApplyMode: boolean;
  readonly requestedApplyMode: FirestoreSeedApplyMode | null;
  readonly liveApplyEnvironmentEnabled: boolean;
  readonly hasEnvironmentName: boolean;
  readonly environmentName: string;
  readonly hasTrustedActorId: boolean;
  readonly hasAuditReason: boolean;
  readonly usesExampleClubOnly: boolean;
  readonly usesExampleSquadOnly: boolean;
  readonly usesExampleAthleteOnly: boolean;
  readonly noRealJuniorData: boolean;
  readonly noServiceAccountFileRequiredInRepo: boolean;
  readonly firebaseAdminInitialisationAvoided: boolean;
  readonly firestoreWritingAvoided: boolean;
  readonly summary: readonly string[];
}

export interface FirestoreSeedApplySafetyGateResult {
  readonly status: 'blocked' | 'allowed';
  readonly canApplySeedNow: boolean;
  readonly requestedApplyMode: FirestoreSeedApplyMode | null;
  readonly requiredConfirmationPhrase: typeof REQUIRED_FIRESTORE_SEED_APPLY_CONFIRMATION_PHRASE;
  readonly blockReasons: readonly FirestoreSeedApplyBlockReason[];
  readonly checklist: FirestoreSeedApplySafetyChecklist;
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function getEnvironmentName(input: FirestoreSeedApplySafetyGateInput) {
  return hasText(input.environmentName) ? input.environmentName.trim() : 'not provided';
}

function getNestedStringValues(value: unknown, keyName: string): readonly string[] {
  if (Array.isArray(value)) {
    return value.flatMap((nestedValue) => getNestedStringValues(nestedValue, keyName));
  }

  if (typeof value !== 'object' || value === null) {
    return [];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => [
    ...(key === keyName && typeof nestedValue === 'string' ? [nestedValue] : []),
    ...getNestedStringValues(nestedValue, keyName),
  ]);
}

function getNestedStringArrayValues(value: unknown, keyName: string): readonly string[] {
  if (Array.isArray(value)) {
    return value.flatMap((nestedValue) => getNestedStringArrayValues(nestedValue, keyName));
  }

  if (typeof value !== 'object' || value === null) {
    return [];
  }

  return Object.entries(value).flatMap(([key, nestedValue]) => {
    const directValues =
      key === keyName && Array.isArray(nestedValue)
        ? nestedValue.filter((arrayValue): arrayValue is string => typeof arrayValue === 'string')
        : [];

    return [...directValues, ...getNestedStringArrayValues(nestedValue, keyName)];
  });
}

function getSeedPlanPathValues(seedPlan: FirestoreSeedPlan | null, pathSegment: string): readonly string[] {
  if (!seedPlan) {
    return [];
  }

  return seedPlan.operations.flatMap((operation) => {
    const segments = operation.path.split('/');
    const segmentIndex = segments.indexOf(pathSegment);

    const value = segmentIndex >= 0 ? segments[segmentIndex + 1] : undefined;

    return value ? [value] : [];
  });
}

function allValuesMatch(values: readonly string[], requiredValue: string) {
  return values.length > 0 && values.every((value) => value === requiredValue);
}

function seedPlanUsesExampleClubOnly(seedPlan: FirestoreSeedPlan | null) {
  const clubIds = [
    ...getSeedPlanPathValues(seedPlan, 'clubs'),
    ...(seedPlan?.operations.flatMap((operation) => getNestedStringValues(operation.data, 'clubId')) ?? []),
  ];

  return allValuesMatch(clubIds, REQUIRED_FIRESTORE_SEED_CLUB_ID);
}

function seedPlanUsesExampleSquadOnly(seedPlan: FirestoreSeedPlan | null) {
  const squadIds = [
    ...getSeedPlanPathValues(seedPlan, 'squads'),
    ...(seedPlan?.operations.flatMap((operation) => getNestedStringValues(operation.data, 'squadId')) ?? []),
    ...(seedPlan?.operations.flatMap((operation) => getNestedStringArrayValues(operation.data, 'squadIds')) ?? []),
  ];

  return allValuesMatch(squadIds, REQUIRED_FIRESTORE_SEED_SQUAD_ID);
}

function seedPlanUsesExampleAthleteOnly(seedPlan: FirestoreSeedPlan | null) {
  const athleteIds = [
    ...getSeedPlanPathValues(seedPlan, 'athletes'),
    ...getSeedPlanPathValues(seedPlan, 'athleteProgress'),
    ...(seedPlan?.operations.flatMap((operation) => getNestedStringValues(operation.data, 'athleteId')) ?? []),
    ...(seedPlan?.operations.flatMap((operation) => getNestedStringArrayValues(operation.data, 'athleteIds')) ?? []),
  ];

  return allValuesMatch(athleteIds, REQUIRED_FIRESTORE_SEED_ATHLETE_ID);
}

function getSafetySummary(
  blockReasons: readonly FirestoreSeedApplyBlockReason[],
  checklist: Omit<FirestoreSeedApplySafetyChecklist, 'summary'>,
) {
  return [
    checklist.validationPassed
      ? 'Seed plan validation passed.'
      : 'Seed plan validation did not pass, so seed apply must stay blocked.',
    checklist.hasSeedPlan ? 'Seed plan is present.' : 'Seed plan is missing.',
    checklist.confirmationPhraseMatched
      ? 'Required seed apply confirmation phrase matched exactly.'
      : 'Required seed apply confirmation phrase did not match exactly.',
    checklist.requestedApplyMode === 'live'
      ? 'Requested apply mode is live.'
      : 'Requested apply mode is not live, so seed apply must stay blocked.',
    checklist.liveApplyEnvironmentEnabled
      ? 'DRIVE_FIRESTORE_SEED_APPLY environment flag is enabled.'
      : 'DRIVE_FIRESTORE_SEED_APPLY environment flag is not enabled.',
    checklist.hasEnvironmentName ? 'Target environment name is present.' : 'Target environment name is missing.',
    checklist.hasTrustedActorId ? 'Trusted actor id is present.' : 'Trusted actor id is missing.',
    checklist.hasAuditReason ? 'Audit reason is present.' : 'Audit reason is missing.',
    checklist.usesExampleClubOnly
      ? 'Seed data is scoped to example-club only.'
      : 'Seed data is not scoped to example-club only.',
    checklist.usesExampleSquadOnly
      ? 'Seed data is scoped to example-j15-squad only.'
      : 'Seed data is not scoped to example-j15-squad only.',
    checklist.usesExampleAthleteOnly
      ? 'Seed data is scoped to example-athlete only.'
      : 'Seed data is not scoped to example-athlete only.',
    checklist.noRealJuniorData ? 'No real junior data was indicated.' : 'Real junior data was indicated.',
    checklist.noServiceAccountFileRequiredInRepo
      ? 'No service account file is required in the repository.'
      : 'A service account file requirement was indicated, so apply must stay blocked.',
    blockReasons.length === 0
      ? 'All seed apply safety gates passed.'
      : 'One or more seed apply safety gates blocked execution.',
  ];
}

function getFirestoreSeedApplyBlockReasonsFromChecklist(
  checklist: Omit<FirestoreSeedApplySafetyChecklist, 'summary'>,
): readonly FirestoreSeedApplyBlockReason[] {
  const blockReasons: FirestoreSeedApplyBlockReason[] = [];

  if (!checklist.validationPassed) {
    blockReasons.push('invalidSeedPlan');
  }

  if (!checklist.hasSeedPlan) {
    blockReasons.push('missingSeedPlan');
  }

  if (!checklist.hasConfirmationPhrase) {
    blockReasons.push('missingConfirmationPhrase');
  } else if (!checklist.confirmationPhraseMatched) {
    blockReasons.push('confirmationPhraseMismatch');
  }

  if (!checklist.hasRequestedApplyMode) {
    blockReasons.push('missingRequestedApplyMode');
  }

  if (checklist.requestedApplyMode !== 'live') {
    blockReasons.push('requestedApplyModeNotLive');
  }

  if (!checklist.liveApplyEnvironmentEnabled) {
    blockReasons.push('liveApplyEnvironmentNotEnabled');
  }

  if (!checklist.hasEnvironmentName) {
    blockReasons.push('missingEnvironmentName');
  }

  if (!checklist.hasTrustedActorId) {
    blockReasons.push('missingTrustedActorId');
  }

  if (!checklist.hasAuditReason) {
    blockReasons.push('missingAuditReason');
  }

  if (!checklist.usesExampleClubOnly) {
    blockReasons.push('clubIdNotExampleOnly');
  }

  if (!checklist.usesExampleSquadOnly) {
    blockReasons.push('squadIdNotExampleOnly');
  }

  if (!checklist.usesExampleAthleteOnly) {
    blockReasons.push('athleteIdNotExampleOnly');
  }

  if (!checklist.noRealJuniorData) {
    blockReasons.push('realJuniorDataPresent');
  }

  if (!checklist.noServiceAccountFileRequiredInRepo) {
    blockReasons.push('serviceAccountFileRequiredInRepo');
  }

  return Array.from(new Set(blockReasons));
}

export function getFirestoreSeedApplyChecklist(
  input: FirestoreSeedApplySafetyGateInput,
): FirestoreSeedApplySafetyChecklist {
  const validationPassed = input.validationResult?.status === 'valid';
  const hasSeedPlan = input.seedPlan !== null;
  const confirmationPhrase = input.confirmationPhrase;
  const hasConfirmationPhrase = hasText(confirmationPhrase);
  const confirmationPhraseMatched = confirmationPhrase === REQUIRED_FIRESTORE_SEED_APPLY_CONFIRMATION_PHRASE;
  const hasRequestedApplyMode =
    input.requestedApplyMode === 'dryRun' ||
    input.requestedApplyMode === 'apply' ||
    input.requestedApplyMode === 'live';
  const liveApplyEnvironmentEnabled = input.liveApplyEnvironmentEnabled === true;
  const hasEnvironmentName = hasText(input.environmentName);
  const hasTrustedActorId = hasText(input.trustedActorId);
  const hasAuditReason = hasText(input.auditReason);
  const checklistWithoutSummary = {
    validationPassed,
    hasSeedPlan,
    hasConfirmationPhrase,
    confirmationPhraseMatched,
    requiredConfirmationPhrase: REQUIRED_FIRESTORE_SEED_APPLY_CONFIRMATION_PHRASE,
    hasRequestedApplyMode,
    requestedApplyMode: hasRequestedApplyMode ? input.requestedApplyMode : null,
    liveApplyEnvironmentEnabled,
    hasEnvironmentName,
    environmentName: getEnvironmentName(input),
    hasTrustedActorId,
    hasAuditReason,
    usesExampleClubOnly: seedPlanUsesExampleClubOnly(input.seedPlan),
    usesExampleSquadOnly: seedPlanUsesExampleSquadOnly(input.seedPlan),
    usesExampleAthleteOnly: seedPlanUsesExampleAthleteOnly(input.seedPlan),
    noRealJuniorData: input.realJuniorDataPresent !== true,
    noServiceAccountFileRequiredInRepo: input.serviceAccountFileRequiredInRepo !== true,
    firebaseAdminInitialisationAvoided: true,
    firestoreWritingAvoided: true,
  } satisfies Omit<FirestoreSeedApplySafetyChecklist, 'summary'>;
  const blockReasons = getFirestoreSeedApplyBlockReasonsFromChecklist(checklistWithoutSummary);

  return {
    ...checklistWithoutSummary,
    summary: getSafetySummary(blockReasons, checklistWithoutSummary),
  };
}

export function evaluateFirestoreSeedApplySafetyGate(
  input: FirestoreSeedApplySafetyGateInput,
): FirestoreSeedApplySafetyGateResult {
  const checklist = getFirestoreSeedApplyChecklist(input);
  const blockReasons = getFirestoreSeedApplyBlockReasonsFromChecklist(checklist);
  const canApplySeedNow = blockReasons.length === 0;

  return {
    status: canApplySeedNow ? 'allowed' : 'blocked',
    canApplySeedNow,
    requestedApplyMode: checklist.requestedApplyMode,
    requiredConfirmationPhrase: REQUIRED_FIRESTORE_SEED_APPLY_CONFIRMATION_PHRASE,
    blockReasons,
    checklist,
  };
}

export function getFirestoreSeedApplySafetyMessage(result: FirestoreSeedApplySafetyGateResult) {
  if (result.canApplySeedNow) {
    return 'Live seed apply safety gate allowed Firestore writes for this trusted caller only.';
  }

  return 'Firestore seed apply remains blocked until every live safety gate passes.';
}
