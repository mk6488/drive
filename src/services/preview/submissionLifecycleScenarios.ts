import type { SubmissionStatus } from '@/src/types/submission';

export interface SubmissionLifecyclePreviewScenario {
  id: SubmissionStatus;
  title: string;
  description: string;
  submissionStatus: SubmissionStatus;
  athleteFacingSummary: string;
  coachFacingSummary: string;
  rewardGateSummary: string;
}

export const submissionLifecyclePreviewScenarios: SubmissionLifecyclePreviewScenario[] = [
  {
    id: 'draft',
    title: 'Draft evidence started',
    description: 'The athlete has started preparing PM5 evidence and reflection, but nothing has been sent for coach review.',
    submissionStatus: 'draft',
    athleteFacingSummary: 'Keep the evidence honest and the reflection short, then submit for coach review when ready.',
    coachFacingSummary: 'No coach action is available because the submission has not entered the review queue.',
    rewardGateSummary: 'Rewards remain locked. Draft work is not eligible for XP, badges, attributes, or progress.',
  },
  {
    id: 'submitted',
    title: 'Submitted for coach review',
    description: 'The athlete has submitted PM5 evidence and reflection and is waiting for coach verification.',
    submissionStatus: 'submitted',
    athleteFacingSummary: 'The athlete can see that the session is waiting for review, but rewards have not unlocked.',
    coachFacingSummary: 'A future coach workflow would review the private evidence, reflection, and quest match.',
    rewardGateSummary: 'Rewards remain locked until a coach verifies the submission in a trusted workflow.',
  },
  {
    id: 'verified',
    title: 'Coach verified evidence',
    description: 'A coach has verified that the evidence matches the quest and can become eligible for future reward processing.',
    submissionStatus: 'verified',
    athleteFacingSummary: 'The athlete can see that coach verification is complete and reward eligibility can be considered later.',
    coachFacingSummary: 'The coach has accepted the evidence. Future trusted reward processing may use this verified record.',
    rewardGateSummary: 'Only this status can become eligible for future reward calculation and progress writes.',
  },
  {
    id: 'rejected',
    title: 'Coach rejected evidence',
    description: 'A coach reviewed the evidence but did not accept it, so the athlete would need to correct and resubmit later.',
    submissionStatus: 'rejected',
    athleteFacingSummary: 'The athlete needs practical coach feedback before correcting evidence or reflection in a future workflow.',
    coachFacingSummary: 'A future coach workflow should give a respectful, training-focused reason for rejection.',
    rewardGateSummary: 'Rewards remain locked. Rejected submissions must not award XP, badges, attributes, or progress.',
  },
];
