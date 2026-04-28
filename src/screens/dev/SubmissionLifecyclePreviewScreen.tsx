import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SubmissionLifecycleTimeline } from '@/src/components/game/SubmissionLifecycleTimeline';
import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  submissionLifecyclePreviewScenarios,
  type SubmissionLifecyclePreviewScenario,
} from '@/src/services/preview/submissionLifecycleScenarios';
import {
  getRewardGateMessage,
  getSubmissionStatusDescription,
  getSubmissionStatusLabel,
  getSubmissionStatusTone,
} from '@/src/services/submissions/submissionStatus';

const initialScenario = submissionLifecyclePreviewScenarios[0];

function SummaryCard({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <Card tone="river" style={styles.summaryCard}>
      <AppText variant="eyebrow" colour={theme.colours.gold}>
        {title}
      </AppText>
      <AppText variant="body" colour={theme.colours.mist}>
        {summary}
      </AppText>
    </Card>
  );
}

export function SubmissionLifecyclePreviewScreen() {
  const [selectedScenario, setSelectedScenario] = useState<SubmissionLifecyclePreviewScenario>(initialScenario);
  const statusLabel = getSubmissionStatusLabel(selectedScenario.submissionStatus);
  const statusTone = getSubmissionStatusTone(selectedScenario.submissionStatus);
  const statusDescription = getSubmissionStatusDescription(selectedScenario.submissionStatus);
  const rewardGateMessage = getRewardGateMessage(selectedScenario.submissionStatus);

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Submission Lifecycle Preview
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          This build-only route lets reviewers inspect the four allowed submission statuses without running a real
          workflow.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Local state selects static scenarios only. There are no uploads, submit actions, approve or reject actions,
          repository writes, Firebase calls, reward calculations, or progress writes here.
        </AppText>
      </View>

      <Card>
        <AppText variant="subtitle">Choose preview scenario</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Switch between statuses to inspect lifecycle copy and reward gate messaging. This does not mutate mock data.
        </AppText>
        <View style={styles.scenarioGrid}>
          {submissionLifecyclePreviewScenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenario.id;

            return (
              <AppButton
                key={scenario.id}
                title={getSubmissionStatusLabel(scenario.submissionStatus)}
                variant={isSelected ? 'primary' : 'secondary'}
                helperText={scenario.title}
                onPress={() => {
                  setSelectedScenario(scenario);
                }}
                style={styles.scenarioButton}
              />
            );
          })}
        </View>
      </Card>

      <Card tone="river">
        <View style={styles.statusHeader}>
          <View style={styles.statusTitle}>
            <AppText variant="eyebrow" colour={theme.colours.gold}>
              Selected lifecycle state
            </AppText>
            <AppText variant="subtitle" colour={theme.colours.parchment}>
              {selectedScenario.title}
            </AppText>
          </View>
          <StatusPill label={statusLabel} tone={statusTone} />
        </View>
        <AppText variant="body" colour={theme.colours.mist}>
          {selectedScenario.description}
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          {statusDescription}
        </AppText>
      </Card>

      <SubmissionLifecycleTimeline submissionStatus={selectedScenario.submissionStatus} />

      <Card>
        <AppText variant="subtitle">Reward Gate</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          {selectedScenario.rewardGateSummary}
        </AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          {rewardGateMessage}
        </AppText>
      </Card>

      <View style={styles.summaryGrid}>
        <SummaryCard title="Athlete view" summary={selectedScenario.athleteFacingSummary} />
        <SummaryCard title="Coach view" summary={selectedScenario.coachFacingSummary} />
      </View>

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Preview boundary
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Future agents must not infer a real product workflow from this route. It is a controlled visual harness for
          draft, submitted, verified, and rejected states only.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
  scenarioGrid: {
    gap: theme.spacing.md,
  },
  scenarioButton: {
    width: '100%',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  statusTitle: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  summaryGrid: {
    gap: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
  },
});
