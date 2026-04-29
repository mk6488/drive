import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { AuthSession } from '@/src/services/auth/authTypes';

type AuthSessionStatusPanelProps = {
  session: AuthSession;
  isLoading: boolean;
  authErrorMessage?: string | null;
};

function getStatusLabel(session: AuthSession, isLoading: boolean, authErrorMessage?: string | null) {
  if (authErrorMessage) {
    return 'Auth boundary warning';
  }

  if (isLoading) {
    return 'Checking auth session';
  }

  if (session.status === 'authenticated') {
    return 'Authenticated session';
  }

  if (session.status === 'incomplete') {
    return 'Incomplete DRIVE claims';
  }

  return 'Unauthenticated session';
}

function getStatusCopy(session: AuthSession, isLoading: boolean, authErrorMessage?: string | null) {
  if (authErrorMessage) {
    return authErrorMessage;
  }

  if (isLoading) {
    return 'DRIVE is watching Firebase Auth state through the service boundary. The app stays unauthenticated while this check is in progress.';
  }

  if (session.status === 'authenticated') {
    return `${session.user.displayName} is signed in as ${session.user.role}. This does not enable protected athlete or coach routes yet.`;
  }

  if (session.status === 'incomplete') {
    return 'Account is not ready for DRIVE access yet. Firebase Auth is signed in, but trusted DRIVE role claims are missing or incomplete.';
  }

  return 'No DRIVE session is active. Preview routes remain open because protected routing is not enabled yet.';
}

function getStatusTone(session: AuthSession, isLoading: boolean, authErrorMessage?: string | null) {
  if (authErrorMessage) {
    return 'attention';
  }

  if (isLoading) {
    return 'neutral';
  }

  if (session.status === 'authenticated') {
    return 'success';
  }

  if (session.status === 'incomplete') {
    return 'attention';
  }

  return 'bronze';
}

export function AuthSessionStatusPanel({ session, isLoading, authErrorMessage }: AuthSessionStatusPanelProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="subtitle">Auth session shell</AppText>
          <AppText variant="body" colour={theme.colours.mutedInk}>
            {getStatusCopy(session, isLoading, authErrorMessage)}
          </AppText>
        </View>
        <StatusPill label={getStatusLabel(session, isLoading, authErrorMessage)} tone={getStatusTone(session, isLoading, authErrorMessage)} />
      </View>

      <AppText variant="caption" colour={theme.colours.mutedInk}>
        Role gate rules now exist as a preview foundation, but protected routes, redirects, Firestore profile lookup,
        and repository provider switching are still deliberately out of scope.
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
});
