import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import type { SquadMission, SquadMissionProgress, SquadMissionTarget } from '@/src/types';

type SquadMissionCardProps = {
  mission: SquadMission;
  progress: SquadMissionProgress;
};

function getProgressRatio(current: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(current / target, 1);
}

function ProgressBar({ current, target }: Pick<SquadMissionTarget, 'current' | 'target'>) {
  const ratio = getProgressRatio(current, target);
  const remaining = Math.max(1 - ratio, 0);

  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { flex: ratio }]} />
      <View style={{ flex: remaining }} />
    </View>
  );
}

export function SquadMissionCard({ mission, progress }: SquadMissionCardProps) {
  return (
    <GamePanel title={mission.title} eyebrow="Squad mission preview" status="Preview only" statusTone="attention">
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          {mission.description}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Verified training unlocks squad progress. This preview does not calculate rewards or write progress.
        </AppText>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              Sessions
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {progress.completedVerifiedSessions ?? 0}
            </AppText>
            <AppText variant="caption" colour={theme.colours.parchmentMuted}>
              completed verified sessions
            </AppText>
          </View>
          <View style={styles.summaryItem}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              Squad
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {progress.squadContribution ?? progress.current}/{progress.target}
            </AppText>
            <AppText variant="caption" colour={theme.colours.parchmentMuted}>
              shared contribution
            </AppText>
          </View>
        </View>

        <View style={styles.targetList}>
          {mission.targets.map((target) => (
            <View key={target.id} style={styles.targetRow}>
              <View style={styles.targetHeader}>
                <AppText variant="label" colour={theme.colours.parchment}>
                  {target.label}
                </AppText>
                <AppText variant="caption" colour={theme.colours.gold}>
                  {target.current}/{target.target} {target.unit}
                </AppText>
              </View>
              <ProgressBar current={target.current} target={target.target} />
              <AppText variant="caption" colour={theme.colours.parchmentMuted}>
                {target.description}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.riverDeep,
    padding: theme.spacing.md,
  },
  targetList: {
    gap: theme.spacing.md,
  },
  targetRow: {
    gap: theme.spacing.sm,
  },
  targetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 10,
    overflow: 'hidden',
    borderRadius: theme.radius.round,
    backgroundColor: theme.colours.riverNight,
  },
  progressFill: {
    minWidth: 4,
    backgroundColor: theme.colours.gold,
  },
});
