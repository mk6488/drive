export type SubmissionStatus = 'draft' | 'submitted' | 'verified' | 'rejected';

export interface Submission {
  id: string;
  questId: string;
  athleteId: string;
  clubId: string;
  squadId: string;
  pm5PhotoPath: string;
  reflection: string;
  status: SubmissionStatus;
  submittedAt?: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  coachNote?: string;
}

// Only verified submissions should be used to unlock reward results and progress updates.
