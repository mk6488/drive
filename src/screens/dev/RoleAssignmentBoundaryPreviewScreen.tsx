import { StyleSheet, View } from 'react-native';

import { RoleAssignmentBoundaryPanel } from '@/src/components/game/RoleAssignmentBoundaryPanel';
import { AppText } from '@/src/components/ui/AppText';
import { Card } from '@/src/components/ui/Card';
import { Screen } from '@/src/components/ui/Screen';
import { StatusPill } from '@/src/components/ui/StatusPill';
import { theme } from '@/src/constants/theme';
import {
  getRoleAssignmentSafetyMessage,
  validateAthleteRoleAssignmentInput,
  validateCoachRoleAssignmentInput,
  validateRoleAssignmentPlan,
  type RoleAssignmentValidationResult,
} from '@/src/services/auth/roleAssignmentBoundary';

const safeAthleteExample = validateAthleteRoleAssignmentInput({
  targetUserId: 'firebase-user-example-athlete',
  role: 'athlete',
  clubId: 'club-example-001',
  squadIds: ['squad-example-juniors'],
  linkedAthleteId: 'athlete-example-001',
  displayName: 'Example Athlete',
});

const safeCoachExample = validateCoachRoleAssignmentInput({
  targetUserId: 'firebase-user-example-coach',
  role: 'coach',
  clubId: 'club-example-001',
  squadIds: ['squad-example-juniors'],
  displayName: 'Example Coach',
});

const blockedPlanExample = validateRoleAssignmentPlan({
  actor: {
    actorKind: 'trustedServerWorkflow',
    actorId: '',
    auditReason: '',
  },
  assignment: {
    targetUserId: 'firebase-user-example-admin',
    role: 'adminFuture',
    clubId: 'club-example-001',
    displayName: 'Example Admin Future',
  },
  target: {
    targetUserId: 'firebase-user-example-admin',
    clubId: 'club-example-001',
    displayName: 'Example Admin Future',
  },
  futureServerWorkflowRequired: true,
});

const validationExamples: readonly {
  title: string;
  result: RoleAssignmentValidationResult;
}[] = [
  {
    title: 'Safe athlete input shape',
    result: safeAthleteExample,
  },
  {
    title: 'Safe coach input shape',
    result: safeCoachExample,
  },
  {
    title: 'Blocked future admin plan',
    result: blockedPlanExample,
  },
];

function formatMissingFields(result: RoleAssignmentValidationResult) {
  if (result.missingFields.length === 0) {
    return 'No missing required fields for a future trusted workflow shape.';
  }

  return result.missingFields.join(', ');
}

function ValidationExampleCard({ title, result }: { title: string; result: RoleAssignmentValidationResult }) {
  return (
    <Card>
      <View style={styles.exampleHeader}>
        <View style={styles.titleGroup}>
          <AppText variant="eyebrow" colour={theme.colours.bronze}>
            Example validation
          </AppText>
          <AppText variant="subtitle">{title}</AppText>
        </View>
        <StatusPill
          label={result.isReadyForTrustedWorkflow ? 'Shape ready' : 'Blocked'}
          tone={result.isReadyForTrustedWorkflow ? 'success' : 'attention'}
        />
      </View>

      <AppText variant="body" colour={theme.colours.mutedInk}>
        {getRoleAssignmentSafetyMessage(result)}
      </AppText>

      <View style={styles.detailList}>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          Role: {result.role ?? 'None recognised'}
        </AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          Client assignment allowed: {result.isClientAssignmentAllowed ? 'Yes' : 'No'}
        </AppText>
        <AppText variant="caption" colour={theme.colours.mutedInk}>
          Missing fields: {formatMissingFields(result)}
        </AppText>
      </View>
    </Card>
  );
}

export function RoleAssignmentBoundaryPreviewScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <StatusPill label="Developer preview" tone="bronze" />
        <AppText variant="title" colour={theme.colours.parchment}>
          Role Assignment Boundary Preview
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          Review the planning boundary for future trusted role assignment without creating accounts, assigning roles,
          setting custom claims, or enabling protected routes.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          This screen is planning only. Trusted server implementation is future work and this route does not read or
          write Firestore, call Firebase Admin SDK, run Cloud Functions, or expose role assignment tools.
        </AppText>
      </View>

      <RoleAssignmentBoundaryPanel />

      {validationExamples.map((example) => (
        <ValidationExampleCard key={example.title} title={example.title} result={example.result} />
      ))}

      <Card tone="river">
        <AppText variant="subtitle" colour={theme.colours.parchment}>
          Future trusted workflow only
        </AppText>
        <AppText variant="body" colour={theme.colours.mist}>
          A later approved server-side process may assign Firebase custom claims after product, security, audit, and
          safeguarding decisions are settled. This preview deliberately does not implement that process.
        </AppText>
        <AppText variant="caption" colour={theme.colours.parchmentMuted}>
          Future agents must not infer public signup, account creation, client-side claim writing, Firestore reads or
          writes, Storage upload, real PM5 submission, reward calculation, or progress writes from this foundation.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.md,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  titleGroup: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  detailList: {
    gap: theme.spacing.xs,
  },
});
