import { StyleSheet, View } from 'react-native';

import { AuthClaimsDiagnosticPanel } from '@/src/components/game/AuthClaimsDiagnosticPanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { useDriveAuth } from '@/src/services/auth/AuthProvider';

export function AuthClaimsDiagnosticPreviewScreen() {
  const { session, isLoading, authErrorMessage } = useDriveAuth();

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Auth Claims Diagnostic Preview
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Inspect whether the current Firebase Auth session has complete DRIVE role claims without enabling protected
          routes or assigning any claims from the client app.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          This route is diagnostic only. It does not read Firestore, write Firestore, create accounts, set custom claims,
          redirect users, or unlock athlete and coach areas.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Current auth provider state</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Auth provider check: {isLoading ? 'checking current Firebase Auth state' : 'current state loaded'}.
        </AppText>
        {authErrorMessage ? (
          <AppText variant="caption" colour={theme.colours.danger}>
            {authErrorMessage}
          </AppText>
        ) : null}
      </Card>

      <AuthClaimsDiagnosticPanel session={session} />

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Trusted role assignment later
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Firebase custom claims cannot be assigned from this client app. A later explicit trusted process must decide
          which existing Firebase users receive athlete or coach role claims.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Future agents must not infer public signup, account creation, Firebase Admin SDK, Cloud Functions, protected
          routes, Firestore reads or writes, Storage upload, real PM5 submission, reward calculation, or progress writes
          from this diagnostic.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
});
