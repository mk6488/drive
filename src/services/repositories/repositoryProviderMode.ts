export type RepositoryProviderMode = 'mock' | 'firebase';

const repositoryProviderEnvironmentKey = 'EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER';
const allowedRepositoryProviderModes = ['mock', 'firebase'] as const satisfies readonly RepositoryProviderMode[];

function readRepositoryProviderModeEnvironmentValue() {
  return process.env[repositoryProviderEnvironmentKey];
}

function isRepositoryProviderMode(value: string): value is RepositoryProviderMode {
  return allowedRepositoryProviderModes.includes(value as RepositoryProviderMode);
}

export function getRequestedRepositoryProviderMode(): RepositoryProviderMode {
  const requestedMode = readRepositoryProviderModeEnvironmentValue();

  if (!requestedMode || !isRepositoryProviderMode(requestedMode)) {
    return 'mock';
  }

  return requestedMode;
}

export function getRepositoryProviderModeStatus() {
  const rawRequestedMode = readRepositoryProviderModeEnvironmentValue();
  const requestedProviderMode = getRequestedRepositoryProviderMode();
  const hasExplicitModeValue = Boolean(rawRequestedMode);
  const hasInvalidModeValue = Boolean(rawRequestedMode && !isRepositoryProviderMode(rawRequestedMode));

  return {
    environmentKey: repositoryProviderEnvironmentKey,
    rawRequestedMode,
    requestedProviderMode,
    hasExplicitModeValue,
    hasInvalidModeValue,
    isFirebaseExplicitlyRequested: rawRequestedMode === 'firebase',
    isUsingDefaultMockMode: !rawRequestedMode || hasInvalidModeValue,
  };
}
