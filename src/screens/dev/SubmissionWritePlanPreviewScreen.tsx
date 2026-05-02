import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/src/components/ui/AppButton';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  createAthleteDraftSubmissionWriteDocumentPlan,
  createAthleteSubmitForReviewWriteDocumentPlan,
  type SubmissionWriteDocumentPlan,
} from '@/src/services/submissions/submissionWriteDocumentPlan';
import {
  getSubmissionWriteBlockReasonMessage,
  getSubmissionWritePlanSummary,
  type AthleteDraftSubmissionWriteInput,
  type AthleteSubmitForReviewWriteInput,
  type SubmissionWriteCommandType,
} from '@/src/services/submissions/submissionWriteCommandService';

const exampleIds = {
  clubId: 'example-club',
  squadId: 'example-j15-squad',
  athleteId: 'example-athlete',
  questId: 'example-quest-rate-20',
  submissionId: 'example-submission-rate-20',
  pm5PhotoPath: 'clubs/example-club/submissions/example-submission-rate-20/pm5/example-pm5-screen.jpg',
};

const draftInput: AthleteDraftSubmissionWriteInput = {
  ...exampleIds,
  currentStatus: null,
  targetStatus: 'draft',
  reflection: 'Held the rate cap and noted where the rhythm felt most stable.',
};

const submitInput: AthleteSubmitForReviewWriteInput = {
  ...exampleIds,
  currentStatus: 'draft',
  targetStatus: 'submitted',
  reflection: 'Held rate 20 well. Next time I would settle earlier in the first five minutes.',
};

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function PreviewBoundaryCard() {
  return (
    <Card tone="river">
      <AppText variant="subtitle" colour={theme.colours.parchment}>
        Developer Preview Boundary
      </AppText>
      <AppText variant="body" colour={theme.colours.mist}>
        This route previews pure submission write plans only. No Firestore write happens, no Storage upload happens, and
        no reward or progress write happens.
      </AppText>
      <AppText variant="caption" colour={theme.colours.parchmentMuted}>
        It uses fake example ids only and does not create live junior data, save drafts, submit for real coach review, or
        unlock rewards.
      </AppText>
    </Card>
  );
}

function DocumentPlanCard({ plan }: { plan: SubmissionWriteDocumentPlan }) {
  const isValid = plan.writePlan.status === 'valid';

  return (
    <Card>
      <View style={styles.statusHeader}>
        <View style={styles.statusTitle}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Plan result
          </AppText>
          <AppText variant="subtitle">{isValid ? 'Valid preview plan' : 'Blocked preview plan'}</AppText>
        </View>
        <StatusPill label={isValid ? 'Valid' : 'Blocked'} tone={isValid ? 'success' : 'attention'} />
      </View>

      <AppText variant="body" colour={theme.colours.mutedInk}>
        {getSubmissionWritePlanSummary(plan.writePlan)}
      </AppText>

      <View style={styles.detailBlock}>
        <AppText variant="label">Document path preview</AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          {plan.documentPath}
        </AppText>
      </View>

      <View style={styles.detailBlock}>
        <AppText variant="label">Block reasons</AppText>
        {plan.writePlan.blockReasons.length > 0 ? (
          plan.writePlan.blockReasons.map((reason) => (
            <AppText key={reason} variant="caption" colour={theme.colours.danger}>
              {getSubmissionWriteBlockReasonMessage(reason)}
            </AppText>
          ))
        ) : (
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            None. This is still a dry-run preview, not a write.
          </AppText>
        )}
      </View>

      <View style={styles.detailBlock}>
        <AppText variant="label">Future document shape</AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          {plan.documentDraft ? formatJson(plan.documentDraft) : 'No document draft is produced while the plan is blocked.'}
        </AppText>
      </View>

      <View style={styles.detailBlock}>
        <AppText variant="label">Safety notes</AppText>
        {plan.notes.map((note) => (
          <AppText key={note} variant="caption" colour={theme.colours.mutedInk}>
            {note}
          </AppText>
        ))}
      </View>
    </Card>
  );
}

export function SubmissionWritePlanPreviewScreen() {
  const [selectedCommand, setSelectedCommand] = useState<SubmissionWriteCommandType>('createOrUpdateDraft');

  const documentPlan = useMemo(() => {
    if (selectedCommand === 'submitForCoachReview') {
      return createAthleteSubmitForReviewWriteDocumentPlan(submitInput);
    }

    return createAthleteDraftSubmissionWriteDocumentPlan(draftInput);
  }, [selectedCommand]);

  const selectedInput = selectedCommand === 'submitForCoachReview' ? submitInput : draftInput;

  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Submission Write Plan
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Inspect pure athlete draft and submit command planning before real writes exist.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Local React state only. No Firestore write, no Firebase Storage upload, no PM5 image picking, no live submit,
          no coach review action, and no reward or progress write.
        </AppText>
      </View>

      <PreviewBoundaryCard />

      <Card>
        <AppText variant="subtitle">Choose athlete intent</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Both examples use fixed fake ids for the seeded preview scope. Buttons only switch local preview state.
        </AppText>
        <View style={styles.commandGrid}>
          <AppButton
            title="Preview draft write plan"
            variant={selectedCommand === 'createOrUpdateDraft' ? 'primary' : 'secondary'}
            helperText="Plans a future create or update with status draft only."
            onPress={() => {
              setSelectedCommand('createOrUpdateDraft');
            }}
            style={styles.commandButton}
          />
          <AppButton
            title="Preview submit for review plan"
            variant={selectedCommand === 'submitForCoachReview' ? 'primary' : 'secondary'}
            helperText="Plans a future draft to submitted transition only."
            onPress={() => {
              setSelectedCommand('submitForCoachReview');
            }}
            style={styles.commandButton}
          />
        </View>
      </Card>

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Example fake input
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          {formatJson(selectedInput)}
        </AppText>
      </Card>

      <DocumentPlanCard plan={documentPlan} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
  commandGrid: {
    gap: theme.spacing.md,
  },
  commandButton: {
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
  detailBlock: {
    gap: theme.spacing.xs,
  },
});
