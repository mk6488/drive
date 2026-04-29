import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { RiverMapProgressPanel } from '@/src/components/game/RiverMapProgressPanel';
import { SquadMissionCard } from '@/src/components/game/SquadMissionCard';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import { getRepositoryProvider } from '@/src/services/repositories/repositoryProvider';
import type { RiverMapProgress, SquadMission, SquadMissionProgress } from '@/src/types';

const previewClubId = 'club-example-001';
const previewSquadId = 'squad-example-juniors';
const { progressReadRepository } = getRepositoryProvider();

type ScreenState = {
  squadMission: SquadMission;
  squadMissionProgress: SquadMissionProgress;
  riverMapProgress: RiverMapProgress;
};

export function AthleteProgressShellScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [state, setState] = useState<ScreenState | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPreviewData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const [squadMission, squadMissionProgress, riverMapProgress] = await Promise.all([
          progressReadRepository.getSquadMission(previewClubId, previewSquadId),
          progressReadRepository.getSquadMissionProgress(previewClubId, previewSquadId),
          progressReadRepository.getRiverMapProgress(previewClubId, previewSquadId),
        ]);

        if (!isMounted) {
          return;
        }

        if (!squadMission || !squadMissionProgress || !riverMapProgress) {
          setState(null);
          return;
        }

        setState({
          squadMission,
          squadMissionProgress,
          riverMapProgress,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setHasError(true);
        setState(null);
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
          <AppText variant="subtitle">Squad Progress Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Loading squad mission and river map preview...
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (hasError) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Squad Progress Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            Preview progress data could not be loaded. Please retry in a later step.
          </AppText>
        </Card>
      </Screen>
    );
  }

  if (!state) {
    return (
      <Screen>
        <Card>
          <AppText variant="subtitle">Squad Progress Preview</AppText>
          <AppText variant="body" colour={theme.colours.mist}>
            No squad progress preview is available yet.
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
          Squad Progress
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          A preview-only look at how coach verified training could build squad identity, mission progress, and the
          winter river journey.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Verification-gated progress</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Progress is about verified training quality, not public ranking, fastest splits, or metres alone. Smaller or
          younger athletes can contribute through discipline, consistency, honest effort, and useful reflections.
        </AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          This shell must not encourage training through pain, illness, injury, or exhaustion. There are no public
          athlete profiles, public rankings, direct messages, or sharing features here.
        </AppText>
      </Card>

      <SquadMissionCard mission={state.squadMission} progress={state.squadMissionProgress} />
      <RiverMapProgressPanel progress={state.riverMapProgress} />

      <Card>
        <AppText variant="subtitle">Boathouse Builder Preview</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          The boathouse preview shows the same verification-gated progress idea as a shared rowing game space, without
          public rankings or live earned resources.
        </AppText>
        <AppButton
          title="Open boathouse preview"
          variant="secondary"
          onPress={() => {
            router.push('/athlete/boathouse');
          }}
          helperText="Preview shell only. No boathouse progress or rewards are written."
        />
      </Card>

      <Card>
        <AppText variant="subtitle">Preview boundaries</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          These values are static mock preview data. They do not come from real submissions, do not calculate rewards,
          and do not write squad, athlete, reward, or river map progress.
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
