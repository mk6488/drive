import type { SubmissionStatus } from '@/src/types/submission';

export interface SubmissionLifecycleStage {
  key: SubmissionStatus;
  label: string;
  description: string;
  isCurrent: boolean;
  isComplete: boolean;
}

const baseLifecycle = {
  draft: {
    label: 'Draft',
    description: 'The athlete has not submitted evidence for coach review yet.',
  },
  submitted: {
    label: 'Awaiting coach review',
    description: 'PM5 evidence and reflection were submitted and are waiting for coach review.',
  },
  verified: {
    label: 'Verified',
    description: 'The coach has verified the evidence. Future trusted reward processing can become eligible.',
  },
  rejected: {
    label: 'Rejected',
    description: 'The evidence was reviewed but not accepted. Rewards remain locked.',
  },
} as const;

const orderedMainStageKeys = ['draft', 'submitted', 'verified'] as const;

function getMainStageCompletion(status: SubmissionStatus): Record<(typeof orderedMainStageKeys)[number], boolean> {
  if (status === 'verified') {
    return { draft: true, submitted: true, verified: true };
  }

  if (status === 'submitted' || status === 'rejected') {
    return { draft: true, submitted: true, verified: false };
  }

  return { draft: true, submitted: false, verified: false };
}

export function getSubmissionLifecycleStages(status: SubmissionStatus): SubmissionLifecycleStage[] {
  const completion = getMainStageCompletion(status);

  const stages: SubmissionLifecycleStage[] = orderedMainStageKeys.map((key) => ({
    key,
    label: baseLifecycle[key].label,
    description: baseLifecycle[key].description,
    isCurrent: status === key,
    isComplete: completion[key],
  }));

  if (status === 'rejected') {
    stages.push({
      key: 'rejected',
      label: baseLifecycle.rejected.label,
      description: baseLifecycle.rejected.description,
      isCurrent: true,
      isComplete: true,
    });
  }

  return stages;
}

export function getCurrentLifecycleStage(status: SubmissionStatus): SubmissionLifecycleStage {
  const current = getSubmissionLifecycleStages(status).find((stage) => stage.isCurrent);

  if (current) {
    return current;
  }

  return {
    key: status,
    label: baseLifecycle[status].label,
    description: baseLifecycle[status].description,
    isCurrent: true,
    isComplete: status !== 'submitted',
  };
}

export function getNextLifecycleMessage(status: SubmissionStatus): string {
  if (status === 'draft') {
    return 'Next: submit PM5 evidence and reflection for coach review.';
  }

  if (status === 'submitted') {
    return 'Next: waiting for coach review before lifecycle can move to verified.';
  }

  if (status === 'rejected') {
    return 'Next: update evidence and reflection, then submit again for coach review.';
  }

  return 'Coach verification is complete in this preview timeline.';
}

export function getLifecycleRoleGuidance(status: SubmissionStatus): string {
  if (status === 'draft') {
    return 'Athlete role: prepare honest PM5 evidence and concise reflection before submitting.';
  }

  if (status === 'submitted') {
    return 'Coach role: review evidence quality, reflection usefulness, and quest match.';
  }

  if (status === 'rejected') {
    return 'Athlete role: correct issues from coach feedback and resubmit for review.';
  }

  return 'Coach role: verification is complete; reward eligibility can be evaluated in future trusted workflows.';
}

export function getLifecycleRewardGateMessage(status: SubmissionStatus): string {
  if (status === 'verified') {
    return 'Reward processing can be eligible only after this verified stage.';
  }

  return 'Rewards stay locked until coach verification is complete.';
}
