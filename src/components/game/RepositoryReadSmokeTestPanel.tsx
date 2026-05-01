import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import type {
  RepositoryReadSmokeTestCheck,
  RepositoryReadSmokeTestReport,
  RepositoryReadSmokeTestStatus,
} from '@/src/services/repositories/repositoryReadSmokeTest';

type RepositoryReadSmokeTestPanelProps = {
  report: RepositoryReadSmokeTestReport;
};

function formatBoolean(value: boolean) {
  return value ? 'Yes' : 'No';
}

function formatMode(mode: RepositoryReadSmokeTestReport['activeProviderMode']) {
  return mode === 'firebase' ? 'Firebase' : 'Mock';
}

function getStatusLabel(status: RepositoryReadSmokeTestStatus) {
  switch (status) {
    case 'passed':
      return 'Passed';
    case 'failed':
      return 'Failed';
    case 'skipped':
      return 'Skipped';
    default:
      return status;
  }
}

function getStatusTone(status: RepositoryReadSmokeTestStatus) {
  switch (status) {
    case 'passed':
      return 'success' as const;
    case 'failed':
      return 'attention' as const;
    case 'skipped':
      return 'neutral' as const;
    default:
      return 'neutral' as const;
  }
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

function SmokeTestCheckCard({ check }: { check: RepositoryReadSmokeTestCheck }) {
  return (
    <View style={styles.checkCard}>
      <View style={styles.checkHeader}>
        <View style={styles.titleGroup}>
          <AppText variant="label">{check.label}</AppText>
          <AppText variant="caption" colour={theme.colours.mutedInk}>
            Expected id: {check.expectedId}
          </AppText>
        </View>
        <StatusPill label={getStatusLabel(check.status)} tone={getStatusTone(check.status)} />
      </View>
      <DetailRow label="Provider mode" value={formatMode(check.providerMode)} />
      <AppText variant="body" colour={theme.colours.mutedInk}>
        {check.detail}
      </AppText>
    </View>
  );
}

export function RepositoryReadSmokeTestPanel({ report }: RepositoryReadSmokeTestPanelProps) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Repository read smoke test
          </AppText>
          <AppText variant="subtitle">Expected fake data reads</AppText>
        </View>
        <StatusPill label={getStatusLabel(report.status)} tone={getStatusTone(report.status)} />
      </View>

      <View style={styles.detailGrid}>
        <DetailRow label="Requested provider mode" value={formatMode(report.requestedProviderMode)} />
        <DetailRow label="Active provider mode" value={formatMode(report.activeProviderMode)} />
        <DetailRow label="Dataset under test" value={report.expectedDatasetLabel} />
        <DetailRow label="Expected club" value={report.expectedClubId} />
        <DetailRow label="Expected squad" value={report.expectedSquadId} />
        <DetailRow label="Expected athlete" value={report.expectedAthleteId} />
        <DetailRow label="Mock fallback active" value={formatBoolean(report.isUsingMockFallback)} />
        <DetailRow label="Firebase config appears complete" value={formatBoolean(report.firebaseConfigComplete)} />
      </View>

      <View style={styles.notice}>
        <AppText variant="label">Read-only boundary</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          {report.readOnlyNotice}
        </AppText>
      </View>

      <View style={styles.notice}>
        <AppText variant="label">What this does not test</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          {report.limitationNotice}
        </AppText>
      </View>

      <View style={styles.checkList}>
        {report.checks.map((check) => (
          <SmokeTestCheckCard key={check.id} check={check} />
        ))}
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
  checkList: {
    gap: theme.spacing.md,
  },
  checkCard: {
    gap: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colours.parchmentDeep,
    padding: theme.spacing.md,
  },
  checkHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
});
