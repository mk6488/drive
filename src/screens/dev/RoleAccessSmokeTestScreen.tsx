import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { RoleAccessSmokeTestPanel } from '@/src/components/game/RoleAccessSmokeTestPanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { useDriveAuth } from '@/src/services/auth/AuthProvider';
import {
  getExpectedAccessSummaryForRole,
  getRoleAccessSmokeTestResults,
} from '@/src/services/auth/roleAccessSmokeTest';

export function RoleAccessSmokeTestScreen() {
  const { session, isLoading, authErrorMessage } = useDriveAuth();
  const smokeTest = useMemo(() => getRoleAccessSmokeTestResults(session), [session]);
  const expectedSummary = useMemo(() => getExpectedAccessSummaryForRole(smokeTest.role), [smokeTest.role]);

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Role Access Smoke Test
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Inspect what the current signed-in Firebase Auth session would be expected to access under DRIVE role access
          rules, after test coach or athlete claims have been applied by a trusted process.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Protected routes are still not enabled. This preview reports decisions only and keeps public, athlete, coach,
          and developer preview routes visible.
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

      <RoleAccessSmokeTestPanel smokeTest={smokeTest} expectedSummary={expectedSummary} />

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Safe preview boundary
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Use this after applying test coach or athlete claims to confirm the current session shape and expected route
          decisions. It does not grant access, redirect users, hide screens, switch the app to Firebase repositories, or
          touch Firestore.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Future agents must not infer public signup, account creation, PM5 upload, submit actions, approve or reject
          actions, reward calculation, progress writes, admin bypass behaviour, or protected route enforcement from this
          smoke test.
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
