import type { SubmissionStatus } from '@/src/types/submission';

export type SubmissionStatusTone = 'neutral' | 'attention' | 'success';

// This service centralises status display and verification gate decisions only.
// It does not calculate rewards, write progress, or trigger any workflow actions.
export function getSubmissionStatusLabel(status: SubmissionStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'submitted':
      return 'Awaiting coach review';
    case 'verified':
      return 'Verified';
    case 'rejected':
      return 'Rejected';
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

export function getSubmissionStatusTone(status: SubmissionStatus): SubmissionStatusTone {
  switch (status) {
    case 'draft':
      return 'neutral';
    case 'submitted':
      return 'attention';
    case 'verified':
      return 'success';
    case 'rejected':
      return 'attention';
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

export function getSubmissionStatusDescription(status: SubmissionStatus): string {
  switch (status) {
    case 'draft':
      return 'This submission is still a draft and has not been sent for coach review.';
    case 'submitted':
      return 'This submission has been sent and is awaiting coach review.';
    case 'verified':
      return 'A coach has verified this submission, so reward workflows may proceed.';
    case 'rejected':
      return 'A coach reviewed this submission and rejected it, so updates are needed before rewards can unlock.';
    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}

export function isSubmissionAwaitingCoachReview(status: SubmissionStatus): boolean {
  return status === 'submitted';
}

export function isSubmissionVerified(status: SubmissionStatus): boolean {
  return status === 'verified';
}

export function canSubmissionUnlockRewards(status: SubmissionStatus): boolean {
  return status === 'verified';
}

export function getRewardGateMessage(status: SubmissionStatus): string {
  if (canSubmissionUnlockRewards(status)) {
    return 'Coach verification is complete. Reward workflows can run in a trusted backend step.';
  }

  if (status === 'rejected') {
    return 'This submission was rejected. Update the evidence and reflection, then resubmit for coach review.';
  }

  if (status === 'submitted') {
    return 'This submission is awaiting coach review. Rewards remain locked until verification is complete.';
  }

  return 'This submission is still a draft. Submit it for coach review before rewards can unlock.';
}
