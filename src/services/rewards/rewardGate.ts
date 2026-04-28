import { canSubmissionUnlockRewards } from '@/src/services/submissions/submissionStatus';
import type { SubmissionStatus } from '@/src/types/submission';

export function canProcessRewardPreview(status: SubmissionStatus): boolean {
  return canSubmissionUnlockRewards(status);
}

export function getRewardLockReason(status: SubmissionStatus): string | null {
  if (status === 'verified') {
    return null;
  }

  if (status === 'submitted') {
    return 'Coach review is still pending. Reward processing remains locked until verification.';
  }

  if (status === 'rejected') {
    return 'This submission was rejected. Rewards stay locked until evidence is updated and verified.';
  }

  return 'This submission is a draft. Submit for coach review before reward processing can begin.';
}
