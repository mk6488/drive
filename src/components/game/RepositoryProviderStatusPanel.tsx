import { StyleSheet, View } from 'react-native';

import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';

type RepositoryProviderMode = 'mock' | 'firebase';

type RepositoryProviderStatus = {
  environmentKey: string;
  rawRequestedMode?: string;
  requestedProviderMode: RepositoryProviderMode;
  activeProviderMode: RepositoryProviderMode;
  hasExplicitModeValue: boolean;
  hasInvalidModeValue: boolean;
  isUsingDefaultMockMode: boolean;
  isFirebaseExplicitlyRequested: boolean;
  isUsingMockFallback: boolean;
  firebaseConfigComplete: boolean;
  missingFirebaseConfigKeys: string[];
};

type RepositoryProviderStatusPanelProps = {
  status: RepositoryProviderStatus;
};

function formatBoolean(value: boolean) {
  return value ? 'Yes' : 'No';
}

function formatMode(mode: RepositoryProviderMode) {
  return mode === 'firebase' ? 'Firebase' : 'Mock';
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statusRow}>
      <AppText variant="caption" colour={theme.colours.mutedInk} style={styles.statusLabel}>
        {label}
      </AppText>
      <AppText variant="body" colour={theme.colours.ink} style={styles.statusValue}>
        {value}
      </AppText>
    </View>
  );
}

export function RepositoryProviderStatusPanel({ status }: RepositoryProviderStatusPanelProps) {
  const hasMissingConfigKeys = status.missingFirebaseConfigKeys.length > 0;
  const requestedModeCopy = status.hasInvalidModeValue
    ? `${formatMode(status.requestedProviderMode)} (invalid env value fell back to mock)`
    : formatMode(status.requestedProviderMode);

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Repository provider
          </AppText>
          <AppText variant="subtitle">Active provider status</AppText>
        </View>
        <StatusPill
          label={status.activeProviderMode === 'firebase' ? 'Firebase requested' : 'Mock safe default'}
          tone={status.activeProviderMode === 'firebase' ? 'attention' : 'success'}
        />
      </View>

      <View style={styles.statusList}>
        <StatusRow label="Requested provider mode" value={requestedModeCopy} />
        <StatusRow label="Active provider mode" value={formatMode(status.activeProviderMode)} />
        <StatusRow label="Mock fallback active" value={formatBoolean(status.isUsingMockFallback)} />
        <StatusRow label="Firebase config appears complete" value={formatBoolean(status.firebaseConfigComplete)} />
        <StatusRow
          label="Provider env key"
          value={status.rawRequestedMode ? `${status.environmentKey}=${status.rawRequestedMode}` : `${status.environmentKey} is unset`}
        />
      </View>

      <View style={styles.notice}>
        <AppText variant="label">Mock mode is the safe default</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Preview mode stays mock backed unless Firebase is explicitly requested and configuration appears complete. This
          keeps DRIVE review routes available without a Firebase project.
        </AppText>
      </View>

      <View style={styles.notice}>
        <AppText variant="label">Firebase mode is future controlled testing only</AppText>
        <AppText variant="body" colour={theme.colours.mutedInk}>
          Requesting Firebase mode only selects the future read repository provider when the environment is complete. It
          does not create accounts, protect routes, upload PM5 evidence, write progress, or run reward workflows.
        </AppText>
      </View>

      <View style={styles.missingConfig}>
        <AppText variant="label">Missing Firebase config keys</AppText>
        {hasMissingConfigKeys ? (
          <View style={styles.keyList}>
            {status.missingFirebaseConfigKeys.map((key) => (
              <AppText key={key} variant="caption" colour={theme.colours.mutedInk}>
                {key}
              </AppText>
            ))}
          </View>
        ) : (
          <AppText variant="body" colour={theme.colours.mutedInk}>
            None reported.
          </AppText>
        )}
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
  statusList: {
    gap: theme.spacing.sm,
  },
  statusRow: {
    gap: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colours.parchmentDeep,
    paddingTop: theme.spacing.sm,
  },
  statusLabel: {
    textTransform: 'uppercase',
  },
  statusValue: {
    fontWeight: '800',
  },
  notice: {
    gap: theme.spacing.xs,
  },
  missingConfig: {
    gap: theme.spacing.sm,
  },
  keyList: {
    gap: theme.spacing.xs,
  },
});
