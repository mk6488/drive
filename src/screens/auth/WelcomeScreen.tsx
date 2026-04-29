import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AuthBoundaryPanel } from '@/src/components/game/AuthBoundaryPanel';
import { AuthSessionStatusPanel } from '@/src/components/game/AuthSessionStatusPanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { useDriveAuth } from '@/src/services/auth/AuthProvider';
import { unauthenticatedPreviewSession } from '@/src/services/auth/mockAuthSession';

export function WelcomeScreen() {
  const { session, isLoading, authErrorMessage } = useDriveAuth();

  return (
    <Screen centred>
      <View style={styles.hero}>
        <StatusPill label="Foundation preview" tone="bronze" />
        <AppText variant="eyebrow" colour={theme.colours.gold}>
          Winter erg block
        </AppText>
        <AppText variant="title" colour={theme.colours.parchment}>
          DRIVE: Winter Quest
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Training quality builds progress once coach verified work arrives.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Preview the shell</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          This is not a working login. These routes show the intended athlete and coach spaces before
          real authentication, protected routes, quests, uploads, verification, or rewards are implemented.
          Step 24 adds role gate decision rules only; preview routes remain available while real role-based routing is
          still disabled.
        </AppText>
        <View style={styles.actions}>
          <Link href="/auth/login" asChild>
            <AppButton
              title="Open sign in foundation"
              helperText="No signup or protected routing yet"
            />
          </Link>
          <Link href="/athlete" asChild>
            <AppButton title="Athlete Preview" variant="secondary" helperText="Today's Quest shape only" />
          </Link>
          <Link href="/coach" asChild>
            <AppButton title="Coach Preview" variant="secondary" helperText="Verification role shape only" />
          </Link>
        </View>
      </Card>

      <AuthSessionStatusPanel session={session} isLoading={isLoading} authErrorMessage={authErrorMessage} />

      <AuthBoundaryPanel
        session={unauthenticatedPreviewSession}
        title="No real auth yet"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: theme.spacing.md,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
