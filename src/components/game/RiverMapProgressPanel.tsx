import { StyleSheet, View } from 'react-native';

import { RiverMapNodeCard } from '@/src/components/game/RiverMapNodeCard';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type { RiverMapNode, RiverMapProgress } from '@/src/types';

type RiverMapProgressPanelProps = {
  progress: RiverMapProgress;
};

function getNodeState(node: RiverMapNode, progress: RiverMapProgress) {
  if (node.id === progress.currentNodeId) {
    return 'current';
  }

  if (progress.unlockedNodeIds.includes(node.id)) {
    return 'unlocked';
  }

  return 'locked';
}

export function RiverMapProgressPanel({ progress }: RiverMapProgressPanelProps) {
  const nodes = [...progress.nodes].sort((left, right) => left.order - right.order);
  const currentNode = nodes.find((node) => node.id === progress.currentNodeId);

  return (
    <View style={styles.container}>
      <Card tone="river">
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              River map preview
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {currentNode ? `Now at ${currentNode.title}` : 'Winter river journey'}
            </AppText>
          </View>
          <StatusPill label="Read-only" tone="neutral" />
        </View>

        <AppText variant="body" colour={theme.colours.mist}>
          The river map shows how shared verified training could move the squad through a rowing world. Nodes stay
          locked until future coach verified progress unlocks them.
        </AppText>

        <View style={styles.statGrid}>
          <View style={styles.statItem}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              Verified
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {progress.completedVerifiedSessions}
            </AppText>
            <AppText variant="caption" colour={theme.colours.parchmentMuted}>
              sessions
            </AppText>
          </View>
          <View style={styles.statItem}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              Pacing
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {progress.pacingDisciplineContributions}
            </AppText>
            <AppText variant="caption" colour={theme.colours.parchmentMuted}>
              quality marks
            </AppText>
          </View>
          <View style={styles.statItem}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              Rate
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {progress.rateControlContributions}
            </AppText>
            <AppText variant="caption" colour={theme.colours.parchmentMuted}>
              control marks
            </AppText>
          </View>
          <View style={styles.statItem}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              Reflection
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {progress.reflectionContributions}
            </AppText>
            <AppText variant="caption" colour={theme.colours.parchmentMuted}>
              useful notes
            </AppText>
          </View>
        </View>

        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          No speed ranking, public leaderboard, or metres-only progress is part of this shell.
        </AppText>
      </Card>

      <View style={styles.nodes}>
        {nodes.map((node) => (
          <RiverMapNodeCard key={node.id} node={node} state={getNodeState(node, progress)} />
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
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statItem: {
    minWidth: 128,
    flex: 1,
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.riverDeep,
    padding: theme.spacing.md,
  },
  nodes: {
    gap: theme.spacing.md,
  },
});
