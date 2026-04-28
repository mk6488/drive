import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { BoathouseUpgrade, BoathouseUpgradeStatus } from '@/src/types';

type BoathouseUpgradeCardProps = {
  upgrade: BoathouseUpgrade;
};

function getStatusLabel(status: BoathouseUpgradeStatus) {
  if (status === 'preview-ready') {
    return 'Ready preview';
  }

  if (status === 'preview-building') {
    return 'Building preview';
  }

  return 'Locked preview';
}

function getStatusTone(status: BoathouseUpgradeStatus) {
  if (status === 'preview-ready') {
    return 'attention';
  }

  if (status === 'preview-building') {
    return 'bronze';
  }

  return 'neutral';
}

export function BoathouseUpgradeCard({ upgrade }: BoathouseUpgradeCardProps) {
  const isLocked = upgrade.status === 'preview-locked';

  return (
    <Card tone={isLocked ? 'parchment' : 'river'} style={isLocked ? styles.lockedCard : undefined}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={isLocked ? theme.colours.bronze : theme.colours.gold}>
            Boathouse upgrade
          </AppText>
          <AppText variant="subtitle" colour={isLocked ? theme.colours.ink : theme.colours.parchment}>
            {upgrade.name}
          </AppText>
        </View>
        <StatusPill label={getStatusLabel(upgrade.status)} tone={getStatusTone(upgrade.status)} />
      </View>

      <AppText variant="body" colour={isLocked ? theme.colours.mutedInk : theme.colours.mist}>
        {upgrade.description}
      </AppText>
      <AppText variant="caption" colour={isLocked ? theme.colours.mutedInk : theme.colours.parchmentMuted}>
        Quality gate: {upgrade.qualityUnlockExplanation}
      </AppText>
      <AppText variant="caption" colour={isLocked ? theme.colours.mutedInk : theme.colours.gold}>
        Preview resources: {upgrade.resourceFocus.join(', ')}
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
  lockedCard: {
    opacity: 0.74,
  },
});
