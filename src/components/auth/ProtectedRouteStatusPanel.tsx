import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { AuthSession } from '@/src/services/auth/authTypes';
import {
  getRouteAccessCopy,
  type DriveAppArea,
  type RouteAccessDecision,
} from '@/src/services/auth/routeAccess';

type ProtectedRouteStatusPanelProps = {
  session: AuthSession;
  isLoading: boolean;
  authErrorMessage?: string | null;
  area: DriveAppArea;
  decision: RouteAccessDecision;
  previewModeEnabled: boolean;
};

function getSessionStateLabel(session: AuthSession, isLoading: boolean, authErrorMessage?: string | null) {
  if (authErrorMessage) {
    return 'Auth boundary warning';
  }

  if (isLoading) {
    return 'Checking auth session';
  }

  if (session.status === 'authenticated') {
    return `${session.user.displayName} (${session.user.role})`;
  }

  if (session.status === 'incomplete') {
    return 'Signed in, but DRIVE claims are incomplete';
  }

  return 'Unauthenticated session';
}

function getAreaLabel(area: DriveAppArea) {
  switch (area) {
    case 'athlete':
      return 'Future athlete area';
    case 'coach':
      return 'Future coach area';
    case 'adminFuture':
      return 'Future admin planning';
    case 'dev':
      return 'Developer preview';
    case 'public':
      return 'Public preview';
    default:
      return area;
  }
}

function getDecisionLabel(decision: RouteAccessDecision) {
  return decision.isAllowed ? 'Preview: allowed later' : 'Preview: not authorised later';
}

function getDecisionTone(decision: RouteAccessDecision) {
  return decision.isAllowed ? 'success' : 'attention';
}

export function ProtectedRouteStatusPanel({
  session,
  isLoading,
  authErrorMessage,
  area,
  decision,
  previewModeEnabled,
}: ProtectedRouteStatusPanelProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Preview-only route boundary
          </AppText>
          <AppText variant="subtitle">Future access status</AppText>
        </View>
        <StatusPill label={getDecisionLabel(decision)} tone={getDecisionTone(decision)} />
      </View>

      <View style={styles.detailGrid}>
        <View style={styles.detailItem}>
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            Current session state
          </AppText>
          <AppText variant="body">{getSessionStateLabel(session, isLoading, authErrorMessage)}</AppText>
        </View>
        <View style={styles.detailItem}>
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            Target route area
          </AppText>
          <AppText variant="body">{getAreaLabel(area)}</AppText>
        </View>
        <View style={styles.detailItem}>
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            Route access decision
          </AppText>
          <AppText variant="body">{decision.reason}</AppText>
        </View>
      </View>

      <AppText variant="body" colour={theme.colours.mutedInk}>
        {authErrorMessage ?? getRouteAccessCopy(decision)}
      </AppText>

      <AppText variant="caption" colour={theme.colours.mutedInk}>
        Preview mode is {previewModeEnabled ? 'on' : 'off'}: screens stay visible. No redirects, hidden children,
        navigation changes, Firestore access, or protected-route enforcement are enabled.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  titleGroup: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  detailGrid: {
    gap: theme.spacing.sm,
  },
  detailItem: {
    gap: theme.spacing.xs,
  },
});
