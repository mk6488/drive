import { getRepositoryProvider, getRepositoryProviderStatus } from './repositoryProvider';
import type { RepositoryProviderMode } from './repositoryProviderMode';

export type RepositoryReadSmokeTestStatus = 'passed' | 'failed' | 'skipped';

export type RepositoryReadSmokeTestCheck = {
  id: string;
  label: string;
  expectedId: string;
  status: RepositoryReadSmokeTestStatus;
  detail: string;
  providerMode: RepositoryProviderMode;
};

export type RepositoryReadSmokeTestReport = {
  requestedProviderMode: RepositoryProviderMode;
  activeProviderMode: RepositoryProviderMode;
  isUsingMockFallback: boolean;
  firebaseConfigComplete: boolean;
  status: RepositoryReadSmokeTestStatus;
  checks: RepositoryReadSmokeTestCheck[];
  readOnlyNotice: string;
  limitationNotice: string;
};

const exampleClubId = 'example-club';
const exampleSquadId = 'example-j15-squad';
const exampleAthleteId = 'example-athlete';
const exampleQuestId = 'example-quest-rate-20';
const exampleSubmissionId = 'example-submission-rate-20';

type SmokeTestRead<T> = () => Promise<T | null>;
type SmokeTestMatch<T> = (record: T) => boolean;

async function runReadCheck<T>({
  id,
  label,
  expectedId,
  providerMode,
  read,
  matchesExpectedRecord,
}: {
  id: string;
  label: string;
  expectedId: string;
  providerMode: RepositoryProviderMode;
  read: SmokeTestRead<T>;
  matchesExpectedRecord: SmokeTestMatch<T>;
}): Promise<RepositoryReadSmokeTestCheck> {
  try {
    const record = await read();

    if (!record) {
      return {
        id,
        label,
        expectedId,
        status: 'failed',
        detail: `No record was returned for expected id ${expectedId}.`,
        providerMode,
      };
    }

    if (!matchesExpectedRecord(record)) {
      return {
        id,
        label,
        expectedId,
        status: 'failed',
        detail: `A record was returned, but it did not match expected id ${expectedId}.`,
        providerMode,
      };
    }

    return {
      id,
      label,
      expectedId,
      status: 'passed',
      detail: `Loaded expected fake record ${expectedId} through the active repository provider.`,
      providerMode,
    };
  } catch (error) {
    return {
      id,
      label,
      expectedId,
      status: 'failed',
      detail: error instanceof Error ? error.message : 'Read failed with an unknown error.',
      providerMode,
    };
  }
}

function getReportStatus(checks: readonly RepositoryReadSmokeTestCheck[]): RepositoryReadSmokeTestStatus {
  if (checks.some((check) => check.status === 'failed')) {
    return 'failed';
  }

  if (checks.every((check) => check.status === 'skipped')) {
    return 'skipped';
  }

  return 'passed';
}

export async function runRepositoryReadSmokeTest(): Promise<RepositoryReadSmokeTestReport> {
  const providerStatus = getRepositoryProviderStatus();
  const provider = getRepositoryProvider();
  const providerMode = providerStatus.activeProviderMode;

  const checks: RepositoryReadSmokeTestCheck[] = await Promise.all([
    runReadCheck({
      id: 'athlete',
      label: 'Example athlete',
      expectedId: exampleAthleteId,
      providerMode,
      read: () => provider.athleteRepository.getAthleteById(exampleClubId, exampleAthleteId),
      matchesExpectedRecord: (athlete) => athlete.id === exampleAthleteId,
    }),
    runReadCheck({
      id: 'squad',
      label: 'Example squad',
      expectedId: exampleSquadId,
      providerMode,
      read: () => provider.squadRepository.getSquadById(exampleClubId, exampleSquadId),
      matchesExpectedRecord: (squad) => squad.id === exampleSquadId,
    }),
    runReadCheck({
      id: 'quest',
      label: 'Example quest',
      expectedId: exampleQuestId,
      providerMode,
      read: () => provider.questRepository.getQuestById(exampleClubId, exampleQuestId),
      matchesExpectedRecord: (quest) => quest.id === exampleQuestId,
    }),
    runReadCheck({
      id: 'submission',
      label: 'Example submission',
      expectedId: exampleSubmissionId,
      providerMode,
      read: () =>
        provider.submissionReadRepository.getSubmissionById(
          exampleClubId,
          exampleSquadId,
          exampleAthleteId,
          exampleSubmissionId,
        ),
      matchesExpectedRecord: (submission) => submission.id === exampleSubmissionId,
    }),
    runReadCheck({
      id: 'athlete-progress',
      label: 'Example athlete progress',
      expectedId: exampleAthleteId,
      providerMode,
      read: () => provider.progressReadRepository.getAthleteProgress(exampleClubId, exampleAthleteId),
      matchesExpectedRecord: (progress) => progress.athleteId === exampleAthleteId,
    }),
    runReadCheck({
      id: 'squad-progress',
      label: 'Example squad progress',
      expectedId: exampleSquadId,
      providerMode,
      read: () => provider.progressReadRepository.getSquadMissionProgress(exampleClubId, exampleSquadId),
      matchesExpectedRecord: (progress) => progress.squadId === exampleSquadId,
    }),
  ]);

  return {
    requestedProviderMode: providerStatus.requestedProviderMode,
    activeProviderMode: providerStatus.activeProviderMode,
    isUsingMockFallback: providerStatus.isUsingMockFallback,
    firebaseConfigComplete: providerStatus.firebaseConfigComplete,
    status: getReportStatus(checks),
    checks,
    readOnlyNotice:
      'This smoke test uses read-only repository methods only and does not write, delete, submit, approve, reject, or calculate rewards.',
    limitationNotice:
      'This does not test Firebase Storage, PM5 upload, coach verification, reward calculation, reward writes, athlete progress writes, or squad progress writes.',
  };
}
