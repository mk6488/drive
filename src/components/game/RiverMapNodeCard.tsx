import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { RiverMapNode } from '@/src/types';

type RiverMapNodeState = 'locked' | 'unlocked' | 'current';

type RiverMapNodeCardProps = {
  node: RiverMapNode;
  state: RiverMapNodeState;
};

function getStateLabel(state: RiverMapNodeState) {
  if (state === 'current') {
    return 'Current stop';
  }

  if (state === 'unlocked') {
    return 'Unlocked';
  }

  return 'Locked preview';
}

export function RiverMapNodeCard({ node, state }: RiverMapNodeCardProps) {
  const isLocked = state === 'locked';

  return (
    <Card tone={state === 'current' ? 'river' : 'parchment'} style={isLocked ? styles.lockedCard : undefined}>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={state === 'current' ? theme.colours.gold : theme.colours.bronze}>
            River node {node.order}
          </AppText>
          <AppText variant="subtitle" colour={state === 'current' ? theme.colours.parchment : theme.colours.ink}>
            {node.title}
          </AppText>
        </View>
        <StatusPill label={getStateLabel(state)} tone={state === 'locked' ? 'neutral' : 'attention'} />
      </View>

      <AppText variant="body" colour={state === 'current' ? theme.colours.mist : theme.colours.mutedInk}>
        {node.description}
      </AppText>
      <AppText variant="caption" colour={state === 'current' ? theme.colours.parchmentMuted : theme.colours.mutedInk}>
        Quality focus: {node.qualityFocus}
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
    opacity: 0.7,
  },
});
