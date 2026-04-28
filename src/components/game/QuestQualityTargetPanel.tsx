import { StyleSheet, View } from 'react-native';

import { GamePanel } from '@/src/components/game/GamePanel';
import { AppText } from '@/src/components/ui/AppText';
import { theme } from '@/src/constants/theme';
import type { RewardFocusSummary } from '@/src/services/rewards/rewardRules';

type QuestQualityTargetPanelProps = {
  focusLabel: string;
  focusSummary: RewardFocusSummary;
};

export function QuestQualityTargetPanel({ focusLabel, focusSummary }: QuestQualityTargetPanelProps) {
  return (
    <GamePanel title="Quality Target" eyebrow="Training intent" status="Attribute preview">
      <View style={styles.content}>
        <AppText variant="body" colour={theme.colours.mist}>
          Coaches should set the standard for how the session is executed, not just how far or fast athletes can go.
        </AppText>

        <View style={styles.attributeBox}>
          <AppText variant="label" colour={theme.colours.parchment}>
            {focusLabel} trains
          </AppText>
          <AppText variant="subtitle" colour={theme.colours.gold}>
            {focusSummary.attributes.join(' + ')}
          </AppText>
          <AppText variant="caption" colour={theme.colours.parchmentMuted}>
            {focusSummary.principle}
          </AppText>
        </View>

        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          This is an attribute focus preview only. It does not calculate XP, unlock badges, or write athlete progress.
        </AppText>
      </View>
    </GamePanel>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
  },
  attributeBox: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.bronze,
    backgroundColor: theme.colours.riverDeep,
    padding: theme.spacing.md,
  },
});
