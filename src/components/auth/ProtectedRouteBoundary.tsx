import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProtectedRouteStatusPanel } from '@/src/components/auth/ProtectedRouteStatusPanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { useDriveAuth } from '@/src/services/auth/AuthProvider';
import {
  getRouteAccessDecision,
  type DriveAppArea,
} from '@/src/services/auth/routeAccess';
import { getRouteProtectionModeStatus } from '@/src/services/auth/routeProtectionMode';

type ProtectedRouteBoundaryProps = {
  area: DriveAppArea;
  children: ReactNode;
  targetAthleteId?: string;
  targetClubId?: string;
  targetSquadId?: string;
  previewModeEnabled?: boolean;
};

export function ProtectedRouteBoundary({
  area,
  children,
  targetAthleteId,
  targetClubId,
  targetSquadId,
  previewModeEnabled,
}: ProtectedRouteBoundaryProps) {
  const { session, isLoading, authErrorMessage } = useDriveAuth();
  const routeProtectionModeStatus = useMemo(() => getRouteProtectionModeStatus(), []);
  const effectivePreviewModeEnabled = previewModeEnabled ?? !routeProtectionModeStatus.isEnforcementActive;
  const decision = useMemo(
    () =>
      getRouteAccessDecision(session, area, {
        targetAthleteId,
        targetClubId,
        targetSquadId,
      }),
    [area, session, targetAthleteId, targetClubId, targetSquadId],
  );
  const shouldRenderChildren = effectivePreviewModeEnabled || decision.isAllowed;

  return (
    <View style={styles.container}>
      <ProtectedRouteStatusPanel
        session={session}
        isLoading={isLoading}
        authErrorMessage={authErrorMessage}
        area={area}
        decision={decision}
        previewModeEnabled={effectivePreviewModeEnabled}
        routeProtectionModeStatus={routeProtectionModeStatus}
      />
      {shouldRenderChildren ? children : <AccessDeniedPanel isLoading={isLoading} />}
    </View>
  );
}

function AccessDeniedPanel({ isLoading }: { isLoading: boolean }) {
  return (
    <Card tone="river">
      <View style={styles.deniedHeader}>
        <View style={styles.deniedTitleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Protected route enforcement
          </AppText>
          <AppText variant="subtitle" colour={theme.colours.parchment}>
            {isLoading ? 'Checking access' : 'Access denied'}
          </AppText>
        </View>
        <StatusPill label={isLoading ? 'Checking' : 'Blocked'} tone="attention" />
      </View>

      <AppText variant="body" colour={theme.colours.mist}>
        {isLoading
          ? 'DRIVE is checking the current auth session before rendering this protected preview area.'
          : 'This protected area is not available for the current session in enforced mode.'}
      </AppText>

      <AppText variant="caption" colour={theme.colours.parchmentMuted}>
        No redirect has been run. Public and developer routes remain open, and this boundary does not read or write
        Firestore.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
  deniedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  deniedTitleGroup: {
    flex: 1,
    gap: theme.spacing.xs,
  },
});
