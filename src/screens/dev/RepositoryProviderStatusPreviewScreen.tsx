import { StyleSheet, View } from 'react-native';

import { RepositoryProviderStatusPanel } from '@/src/components/game/RepositoryProviderStatusPanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { getRepositoryProviderStatus } from '@/src/services/repositories/repositoryProvider';

export function RepositoryProviderStatusPreviewScreen() {
  const status = getRepositoryProviderStatus();

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Repository Provider Status Preview
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Inspect the requested and active repository provider mode without running a product workflow or touching live
          Firebase data.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Preview mode does not require a Firebase project. Firebase mode should only be enabled intentionally later for
          controlled repository testing.
        </AppText>
      </View>

      <RepositoryProviderStatusPanel status={status} />

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Preview boundary
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          This screen reports provider configuration only. It does not connect to Firestore, test live data, initialise
          Storage, upload PM5 evidence, submit work, approve or reject submissions, calculate rewards, or write athlete
          or squad progress.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Future agents must not treat this route as proof that Firebase-backed product screens, protected routes,
          account creation, live uploads, or trusted reward workflows are complete.
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
