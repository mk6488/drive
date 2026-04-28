import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BoathouseProgressPanel } from '@/src/components/game/BoathouseProgressPanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { mockProgressReadRepository } from '@/src/services/repositories/mockRepositories';
import type { BoathouseProgress } from '@/src/types';

const previewSquadId = 'squad-example-juniors';

export function AthleteBoathouseShellScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState<BoathouseProgress | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const boathouseProgress = await mockProgressReadRepository.getBoathouseProgress(previewSquadId);

        if (!isMounted) {
          return;
        }

        setProgress(boathouseProgress);
      } catch {
        if (!isMounted) {
          return;
        }

        setHasError(true);
        setProgress(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPreviewData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Boathouse Builder Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Loading boathouse preview...
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (hasError) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Boathouse Builder Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Boathouse preview data could not be loaded. Please retry in a later step.
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (!progress) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Boathouse Builder Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            No boathouse preview is available yet.
          </AppText>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Athlete preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Boathouse Builder
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          A preview-only rowing world where future coach verified training quality could help the squad build the
          boathouse together.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Verification-gated building</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Boathouse progress is about verified training quality, not public ranking, fastest splits, or metres alone.
          Smaller or younger athletes can contribute through discipline, consistency, honest effort, and useful
          reflections.
        </AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Future progress must wait for coach verified sessions and trusted progress workflows. This shell does not
          write rewards, athlete progress, squad progress, or boathouse progress.
        </AppText>
      </Card>

      <BoathouseProgressPanel progress={progress} />

      <Card>
        <AppText variant="subtitle">Safeguarding boundaries</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          DRIVE should not encourage training through pain, illness, injury, or exhaustion. There are no public athlete
          profiles, no public rankings, no direct messages, and no public sharing in this boathouse shell.
        </AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Resource balances and upgrade states are preview-only labels. They are not live earned rewards and do not imply
          that real athlete submissions have produced progress.
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
