import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type {
  ExpectedAccessSummary,
  RoleAccessSmokeTestResults,
} from '@/src/services/auth/roleAccessSmokeTest';

type RoleAccessSmokeTestPanelProps = {
  smokeTest: RoleAccessSmokeTestResults;
  expectedSummary: ExpectedAccessSummary;
};

function formatList(values: readonly string[]) {
  return values.length > 0 ? values.join(', ') : 'None reported';
}

function formatNullable(value: string | null) {
  return value ?? 'None reported';
}

function formatAreaList(values: ExpectedAccessSummary['expectedAccessibleAreas']) {
  return values.length > 0 ? values.join(', ') : 'None';
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText variant="caption" colour={theme.colours.mutedInk} style={styles.detailLabel}>
        {label}
      </AppText>
      <AppText variant="body" colour={theme.colours.ink} style={styles.detailValue}>
        {value}
      </AppText>
    </View>
  );
}

export function RoleAccessSmokeTestPanel({ smokeTest, expectedSummary }: RoleAccessSmokeTestPanelProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Role access smoke test
          </AppText>
          <AppText variant="subtitle">Current signed-in session decisions</AppText>
        </View>
        <StatusPill label="Diagnostic only" tone="bronze" />
      </View>

      <View style={styles.detailGrid}>
        <DetailRow label="Session status" value={smokeTest.sessionStatus} />
        <DetailRow label="Current role" value={smokeTest.role} />
        <DetailRow label="Club scope" value={formatNullable(smokeTest.clubId)} />
        <DetailRow label="Squad scopes" value={formatList(smokeTest.squadIds)} />
        <DetailRow label="Linked athlete" value={formatNullable(smokeTest.linkedAthleteId)} />
      </View>

      <View style={styles.notice}>
        <AppText variant="label">Expected broad behaviour for this role</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          {expectedSummary.summary}
        </AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          Expected available: {formatAreaList(expectedSummary.expectedAccessibleAreas)}. Expected blocked:{' '}
          {formatAreaList(expectedSummary.expectedBlockedAreas)}.
        </AppText>
      </View>

      <View style={styles.areaList}>
        {smokeTest.results.map((result) => (
          <View key={result.area} style={styles.areaCard}>
            <View style={styles.areaHeader}>
              <View style={styles.titleGroup}>
                <AppText variant="label">{result.label}</AppText>
                <AppText variant="caption" colour={theme.colours.mutedInk}>
                  {result.targetContext}
                </AppText>
              </View>
              <StatusPill
                label={result.decision.isAllowed ? 'Preview: accessible' : 'Preview: blocked'}
                tone={result.decision.isAllowed ? 'success' : 'attention'}
              />
            </View>

            <DetailRow label="Decision reason" value={result.decision.reason} />
            <AppText variant="body" colour={theme.colours.mutedInk}>
              {result.explanation}
            </AppText>
            <AppText variant="caption" colour={theme.colours.mutedInk}>
              Enforced now: {result.decision.isEnforced ? 'yes' : 'no'}. Preview only:{' '}
              {result.decision.isPreviewOnly ? 'yes' : 'no'}.
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.notice}>
        <AppText variant="label">Diagnostic boundary</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          {smokeTest.diagnosticNote}
        </AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          Protected routes are still disabled. This panel does not navigate, redirect, hide preview routes, read
          Firestore, write Firestore, upload PM5 evidence, submit work, verify work, calculate rewards, or set custom
          claims.
        </AppText>
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
  detailGrid: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    gap: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colours.parchmentDeep,
    paddingTop: theme.spacing.sm,
  },
  detailLabel: {
    textTransform: 'uppercase',
  },
  detailValue: {
    fontWeight: '800',
  },
  notice: {
    gap: theme.spacing.sm,
  },
  areaList: {
    gap: theme.spacing.md,
  },
  areaCard: {
    gap: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
    padding: theme.spacing.md,
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
});
