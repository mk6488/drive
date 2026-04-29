import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { AuthSession } from '@/src/services/auth/authTypes';
import {
  canAccessAthleteArea,
  canAccessCoachArea,
  canCreateQuestDrafts,
  canReviewSubmissions,
  canViewOwnAthleteData,
} from '@/src/services/auth/roleAccess';

type AuthBoundaryPanelProps = {
  session: AuthSession;
  title?: string;
  linkedAthleteId?: string;
};

function getRoleLabel(session: AuthSession) {
  if (session.status === 'unauthenticated') {
    return 'Unauthenticated preview';
  }

  if (session.status === 'incomplete') {
    return 'Incomplete DRIVE claims';
  }

  if (session.user.role === 'admin') {
    return 'Admin future role';
  }

  return `${session.user.role} preview`;
}

function getAllowedCopy(session: AuthSession, linkedAthleteId?: string) {
  const user = session.user;

  if (!user) {
    return [
      'No protected athlete or coach area should be available without a future authenticated session.',
      'This preview still does not create a real login, signup, token, or protected route.',
    ];
  }

  if (user.role === 'athlete') {
    return [
      canAccessAthleteArea(user)
        ? 'Future athlete access is limited to the athlete area for this signed-in athlete.'
        : 'Athlete area access is not available for this preview user.',
      canViewOwnAthleteData(user, linkedAthleteId ?? user.linkedAthleteId)
        ? 'Future athlete data viewing is scoped to the linked athlete record only.'
        : 'This athlete cannot view another athlete record through this boundary.',
      'Athletes must not verify submissions, create coach quests, or write rewards or progress.',
    ];
  }

  if (user.role === 'coach') {
    return [
      canAccessCoachArea(user)
        ? 'Future coach access is scoped to the coach area for assigned club or squad context.'
        : 'Coach area access requires an assigned club or squad context.',
      canReviewSubmissions(user)
        ? 'Future submission review must stay coach-only for authorised squads.'
        : 'Submission review is not available for this preview user.',
      canCreateQuestDrafts(user)
        ? 'Future quest drafting is coach-scoped and still requires a real save boundary later.'
        : 'Quest drafting is not available for this preview user.',
    ];
  }

  return [
    'Admin is represented for future planning only.',
    'This foundation does not grant broad admin behaviour, management screens, or override permissions.',
  ];
}

export function AuthBoundaryPanel({ session, title = 'Auth and role boundary', linkedAthleteId }: AuthBoundaryPanelProps) {
  const allowedCopy = getAllowedCopy(session, linkedAthleteId);

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="subtitle">{title}</AppText>
          <AppText variant="body" colour={theme.colours.mutedInk}>
            Current preview role: {getRoleLabel(session)}
          </AppText>
        </View>
        <StatusPill label="Preview only" tone="attention" />
      </View>

      <View style={styles.list}>
        {allowedCopy.map((item) => (
          <View key={item} style={styles.listItem}>
            <View style={styles.bullet} />
            <AppText variant="body" colour={theme.colours.mutedInk} style={styles.listText}>
              {item}
            </AppText>
          </View>
        ))}
      </View>

      <AppText variant="caption" colour={theme.colours.mutedInk}>
        Real authentication and protected routes are not implemented yet. These notes only describe the future boundary.
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
  list: {
    gap: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  bullet: {
    width: 8,
    height: 8,
    marginTop: 8,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colours.bronze,
  },
  listText: {
    flex: 1,
  },
});
