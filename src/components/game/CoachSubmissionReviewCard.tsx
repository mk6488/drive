import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';

type CoachSubmissionReviewCardProps = {
  questTitle: string;
  athleteDisplayName: string;
  submissionStatusLabel: string;
  reflectionSummary: string;
  pm5EvidencePath: string;
};

export function CoachSubmissionReviewCard({
  questTitle,
  athleteDisplayName,
  submissionStatusLabel,
  reflectionSummary,
  pm5EvidencePath,
}: CoachSubmissionReviewCardProps) {
  return (
    <Card tone="river">
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="subtitle" colour={theme.colours.parchment}>
            {questTitle}
          </AppText>
          <AppText variant="caption" colour={theme.colours.parchmentMuted}>
            Athlete: {athleteDisplayName}
          </AppText>
        </View>
        <StatusPill
          label={submissionStatusLabel}
          tone={submissionStatusLabel === 'Verified' ? 'success' : 'attention'}
        />
      </View>

      <View style={styles.section}>
        <AppText variant="eyebrow" colour={theme.colours.gold}>
          Reflection summary
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          {reflectionSummary}
        </AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="eyebrow" colour={theme.colours.gold}>
          PM5 evidence
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          {pm5EvidencePath}
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Approve (disabled in preview)"
          variant="secondary"
          disabled
          helperText="Real verification actions are not implemented in this shell."
        />
        <AppButton
          title="Reject (disabled in preview)"
          variant="quiet"
          disabled
          helperText="No submission status changes happen from this screen."
        />
      </View>
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
  section: {
    gap: theme.spacing.xs,
  },
  actions: {
    gap: theme.spacing.md,
  },
});
