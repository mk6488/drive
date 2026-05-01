import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { RepositoryProviderStatusPanel } from '@/src/components/game/RepositoryProviderStatusPanel';
import { RepositoryReadSmokeTestPanel } from '@/src/components/game/RepositoryReadSmokeTestPanel';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { getRepositoryProviderStatus } from '@/src/services/repositories/repositoryProvider';
import {
  runRepositoryReadSmokeTest,
  type RepositoryReadSmokeTestReport,
} from '@/src/services/repositories/repositoryReadSmokeTest';

export function RepositoryReadSmokeTestScreen() {
  const [report, setReport] = useState<RepositoryReadSmokeTestReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const status = getRepositoryProviderStatus();

  const runSmokeTest = async () => {
    setIsRunning(true);
    setErrorMessage(null);

    try {
      const nextReport = await runRepositoryReadSmokeTest();
      setReport(nextReport);
    } catch (error) {
      setReport(null);
      setErrorMessage(error instanceof Error ? error.message : 'Read smoke test failed with an unknown error.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Repository Read Smoke Test
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Run a manual read-only check against the active repository provider to see whether the expected fake DRIVE
          seed records can be loaded through the provider boundary.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          This preview does not write Firestore, switch provider mode, edit environment values, upload PM5 evidence,
          submit work, approve or reject submissions, calculate rewards, or write progress.
        </AppText>
      </View>

      <RepositoryProviderStatusPanel status={status} />

      <Card>
        <AppText variant="subtitle">Manual read check</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Press the button to read the fixed fake example records. Firebase repository mode should only be enabled
          intentionally with environment configuration; mock remains the safe default.
        </AppText>
        <AppButton
          title={isRunning ? 'Running read smoke test...' : 'Run read smoke test'}
          helperText="Reads only through the active repository provider."
          disabled={isRunning}
          onPress={runSmokeTest}
        />
        {isRunning ? (
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            Loading expected fake records through read-only repository methods.
          </AppText>
        ) : null}
        {errorMessage ? (
          <AppText variant="caption" colour={theme.colours.danger}>
            {errorMessage}
          </AppText>
        ) : null}
      </Card>

      {report ? <RepositoryReadSmokeTestPanel report={report} /> : null}

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Safe preview boundary
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          This screen proves only that developer testing can read expected fake records through repository contracts. It
          is not evidence that product workflows, writes, Storage upload, PM5 upload, verification, rewards, protected
          routing, or real junior data handling are complete.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Future agents must keep Firebase implementation details inside repositories or services and must not import
          Firebase repositories directly into screens or presentational components.
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
