import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProtectedRouteStatusPanel } from '@/src/components/auth/ProtectedRouteStatusPanel';
import { theme } from '@/src/constants/theme';
import { useDriveAuth } from '@/src/services/auth/AuthProvider';
import {
  getRouteAccessDecision,
  type DriveAppArea,
} from '@/src/services/auth/routeAccess';

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
  previewModeEnabled = true,
}: ProtectedRouteBoundaryProps) {
  const { session, isLoading, authErrorMessage } = useDriveAuth();
  const decision = useMemo(
    () =>
      getRouteAccessDecision(session, area, {
        targetAthleteId,
        targetClubId,
        targetSquadId,
      }),
    [area, session, targetAthleteId, targetClubId, targetSquadId],
  );

  return (
    <View style={styles.container}>
      <ProtectedRouteStatusPanel
        session={session}
        isLoading={isLoading}
        authErrorMessage={authErrorMessage}
        area={area}
        decision={decision}
        previewModeEnabled={previewModeEnabled}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.lg,
  },
});
