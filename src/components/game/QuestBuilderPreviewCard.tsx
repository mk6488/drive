import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
type QuestBuilderPreviewCardProps = {
  title: string;
  sessionTypeLabel: string;
  durationOrDistance: string;
  targetRate: string;
  targetPaceOrEffort: string;
  executionFocusLabel: string;
  reflectionPrompt: string;
};

export function QuestBuilderPreviewCard({
  title,
  sessionTypeLabel,
  durationOrDistance,
  targetRate,
  targetPaceOrEffort,
  executionFocusLabel,
  reflectionPrompt,
}: QuestBuilderPreviewCardProps) {
  return (
    <Card tone="river">
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.gold}>
            Live preview
          </AppText>
          <AppText variant="subtitle" colour={theme.colours.parchment}>
            {title.trim() || 'Untitled weekly erg quest'}
          </AppText>
        </View>
        <StatusPill label="Preview only" tone="attention" />
      </View>

      <View style={styles.grid}>
        <PreviewField label="Session type" value={sessionTypeLabel} />
        <PreviewField label="Duration or distance" value={durationOrDistance} />
        <PreviewField label="Target rate" value={targetRate} />
        <PreviewField label="Pace or effort guidance" value={targetPaceOrEffort} />
        <PreviewField label="Execution focus" value={executionFocusLabel} />
        <PreviewField label="Reflection prompt" value={reflectionPrompt} />
      </View>

      <AppText variant="caption" colour={theme.colours.parchmentMuted}>
        Rewards remain coach verified and future trusted processing only. No public rankings are part of quest creation.
      </AppText>
    </Card>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <AppText variant="caption" colour={theme.colours.parchmentMuted}>
        {label}
      </AppText>
      <AppText variant="body" colour={theme.colours.parchment}>
        {value.trim() || 'Not set in this draft preview'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
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
  grid: {
    gap: theme.spacing.md,
  },
  field: {
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.riverDeep,
    padding: theme.spacing.md,
  },
});
