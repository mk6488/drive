import { StyleSheet, View } from 'react-native';

import { BoathouseUpgradeCard } from '@/src/components/game/BoathouseUpgradeCard';
import { TrainingResourceChip } from '@/src/components/game/TrainingResourceChip';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { BoathouseProgress } from '@/src/types';

type BoathouseProgressPanelProps = {
  progress: BoathouseProgress;
};

export function BoathouseProgressPanel({ progress }: BoathouseProgressPanelProps) {
  return (
    <View style={styles.container}>
      <Card tone="river">
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              Boathouse builder preview
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {progress.title}
            </AppText>
          </View>
          <StatusPill label="Read-only" tone="neutral" />
        </View>

        <AppText variant="body" colour={theme.colours.mist}>
          {progress.description}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Future boathouse progress must come from coach verified sessions and trusted progress workflows. These values
          are static preview data only.
        </AppText>
      </Card>

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Training resources
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Preview balances show the kind of rowing-world resources the squad could build with verified training quality.
          They are not live earned rewards.
        </AppText>
        <View style={styles.resourceGrid}>
          {progress.resourceBalances.map((balance) => (
            <TrainingResourceChip key={balance.name} balance={balance} />
          ))}
        </View>
      </Card>

      <View style={styles.upgrades}>
        {progress.upgrades.map((upgrade) => (
          <BoathouseUpgradeCard key={upgrade.id} upgrade={upgrade} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
  },
  titleGroup: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  resourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  upgrades: {
    gap: theme.spacing.md,
  },
});
