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

type RoleGatePreviewPanelProps = {
  session: AuthSession;
  area: DriveAppArea;
  decision: RouteAccessDecision;
};

function getSessionLabel(session: AuthSession) {
  if (session.status === 'unauthenticated') {
    return 'Unauthenticated preview session';
  }

  if (session.status === 'incomplete') {
    return 'Signed in, but DRIVE claims are incomplete';
  }

  return `${session.user.displayName} (${session.user.role})`;
}

function getAreaLabel(area: DriveAppArea) {
  switch (area) {
    case 'public':
      return 'Public preview';
    case 'athlete':
      return 'Future athlete area';
    case 'coach':
      return 'Future coach area';
    case 'dev':
      return 'Developer preview';
    case 'adminFuture':
      return 'Future admin planning';
    default:
      return area;
  }
}

export function RoleGatePreviewPanel({ session, area, decision }: RoleGatePreviewPanelProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Role gate preview
          </AppText>
          <AppText variant="subtitle">Future access decision</AppText>
        </View>
        <StatusPill
          label={decision.isAllowed ? 'Decision: described as allowed' : 'Decision: not authorised'}
          tone={decision.isAllowed ? 'success' : 'attention'}
        />
      </View>

      <View style={styles.detailGrid}>
        <View style={styles.detailItem}>
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            Selected session
          </AppText>
          <AppText variant="body">{getSessionLabel(session)}</AppText>
        </View>
        <View style={styles.detailItem}>
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            Target app area
          </AppText>
          <AppText variant="body">{getAreaLabel(area)}</AppText>
        </View>
        <View style={styles.detailItem}>
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            Reason
          </AppText>
          <AppText variant="body">{decision.reason}</AppText>
        </View>
      </View>

      <AppText variant="body" colour={theme.colours.mutedInk}>
        {getRouteAccessCopy(decision)}
      </AppText>

      <AppText variant="caption" colour={theme.colours.mutedInk}>
        This panel is presentational only. It does not navigate, redirect, hide preview routes, read Firebase, call
        repositories, or enforce protected route behaviour.
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
    gap: theme.spacing.md,
  },
  detailItem: {
    gap: theme.spacing.xs,
  },
});
