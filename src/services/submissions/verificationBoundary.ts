import type { SubmissionStatus } from '@/src/types/submission';

export type VerificationReviewBoundary = {
  status: SubmissionStatus;
  canReview: boolean;
  boundaryMessage: string;
};

export type RewardEligibilityBoundary = {
  status: SubmissionStatus;
  canTriggerRewardEligibility: boolean;
  boundaryMessage: string;
};

// Future approve and reject workflows must sit behind a coach verification boundary.
// This file only documents and checks the status gate; it does not mutate submissions.
export function canCoachReviewSubmission(status: SubmissionStatus): boolean {
  return status === 'submitted';
}

// Future reward processing may only become eligible after verification.
// This helper does not calculate rewards, write reward results, or write progress.
export function canCoachTriggerRewardEligibility(status: SubmissionStatus): boolean {
  return status === 'verified';
}

export function getVerificationReviewBoundary(status: SubmissionStatus): VerificationReviewBoundary {
  if (canCoachReviewSubmission(status)) {
    return {
      status,
      canReview: true,
      boundaryMessage: 'Submitted evidence can be reviewed by a coach in a future trusted workflow.',
    };
  }

  if (status === 'draft') {
    return {
      status,
      canReview: false,
      boundaryMessage: 'Draft submissions must not be reviewed until the athlete submits evidence for coach review.',
    };
  }

  if (status === 'verified') {
    return {
      status,
      canReview: false,
      boundaryMessage: 'Verified submissions have already passed coach review and must not be re-reviewed here.',
    };
  }

  return {
    status,
    canReview: false,
    boundaryMessage: 'Rejected submissions must not unlock rewards unless a future resubmission is reviewed and verified.',
  };
}

export function getRewardEligibilityBoundary(status: SubmissionStatus): RewardEligibilityBoundary {
  if (canCoachTriggerRewardEligibility(status)) {
    return {
      status,
      canTriggerRewardEligibility: true,
      boundaryMessage: 'Verified submissions may become eligible for future trusted reward processing.',
    };
  }

  if (status === 'rejected') {
    return {
      status,
      canTriggerRewardEligibility: false,
      boundaryMessage: 'Rejected submissions must not unlock rewards or progress.',
    };
  }

  return {
    status,
    canTriggerRewardEligibility: false,
    boundaryMessage: 'Rewards stay locked until coach verification is complete.',
  };
}
