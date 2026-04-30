export type RouteProtectionMode = 'preview' | 'enforced';

const routeProtectionModeEnvironmentKey = 'EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE';
const allowedRouteProtectionModes = ['preview', 'enforced'] as const satisfies readonly RouteProtectionMode[];

function readRouteProtectionModeEnvironmentValue() {
  return process.env[routeProtectionModeEnvironmentKey];
}

function isRouteProtectionMode(value: string): value is RouteProtectionMode {
  return allowedRouteProtectionModes.includes(value as RouteProtectionMode);
}

export function getRequestedRouteProtectionMode(): RouteProtectionMode {
  const requestedMode = readRouteProtectionModeEnvironmentValue();

  if (!requestedMode || !isRouteProtectionMode(requestedMode)) {
    return 'preview';
  }

  return requestedMode;
}

export function getRouteProtectionModeStatus() {
  const rawRequestedMode = readRouteProtectionModeEnvironmentValue();
  const activeRouteProtectionMode = getRequestedRouteProtectionMode();
  const hasExplicitModeValue = Boolean(rawRequestedMode);
  const hasInvalidModeValue = Boolean(rawRequestedMode && !isRouteProtectionMode(rawRequestedMode));
  const isEnforcementActive = activeRouteProtectionMode === 'enforced';

  return {
    environmentKey: routeProtectionModeEnvironmentKey,
    rawRequestedMode,
    requestedRouteProtectionMode: activeRouteProtectionMode,
    activeRouteProtectionMode,
    hasExplicitModeValue,
    hasInvalidModeValue,
    isUsingDefaultPreviewMode: !rawRequestedMode || hasInvalidModeValue,
    isEnforcedExplicitlyRequested: rawRequestedMode === 'enforced',
    isEnforcementActive,
  };
}

export function shouldEnforceProtectedRoutes() {
  return getRouteProtectionModeStatus().isEnforcementActive;
}
