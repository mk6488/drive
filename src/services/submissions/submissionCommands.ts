export type CommandValidationResult =
  | {
      isValid: true;
      message: string;
    }
  | {
      isValid: false;
      message: string;
    };

export interface CreateSubmissionDraftInput {
  athleteId: string;
  questId: string;
  clubId: string;
  squadId: string;
  reflection?: string;
}

export interface AttachPm5EvidenceInput {
  submissionId: string;
  athleteId: string;
  questId: string;
  clubId: string;
  squadId: string;
  pm5PhotoPath: string;
}

export interface SubmitForCoachReviewInput {
  submissionId: string;
  athleteId: string;
  questId: string;
  clubId: string;
  squadId: string;
  pm5PhotoPath: string;
  reflection: string;
}

export interface CoachVerifySubmissionInput {
  submissionId: string;
  athleteId: string;
  questId: string;
  clubId: string;
  squadId: string;
  coachUserId: string;
  coachNote?: string;
}

export interface CoachRejectSubmissionInput {
  submissionId: string;
  athleteId: string;
  questId: string;
  clubId: string;
  squadId: string;
  coachUserId: string;
  coachNote: string;
}

const maxReflectionLength = 400;
const maxCoachNoteLength = 300;

function valid(message: string): CommandValidationResult {
  return {
    isValid: true,
    message,
  };
}

function invalid(message: string): CommandValidationResult {
  return {
    isValid: false,
    message,
  };
}

export function validateReflectionDraft(reflection: string): CommandValidationResult {
  const trimmedReflection = reflection.trim();

  if (!trimmedReflection) {
    return invalid('Add a short training reflection before a future submission can be sent for coach review.');
  }

  if (trimmedReflection.length > maxReflectionLength) {
    return invalid('Keep the reflection short and focused on the training session.');
  }

  return valid('Reflection is short and ready for future coach review.');
}

export function validatePm5EvidencePath(path: string): CommandValidationResult {
  if (!path.trim()) {
    return invalid('Add a PM5 evidence path before a future submission can be sent for coach review.');
  }

  return valid('PM5 evidence path is present for future coach review.');
}

export function validateCoachNote(note: string): CommandValidationResult {
  const trimmedNote = note.trim();

  if (!trimmedNote) {
    return invalid('Add a respectful, practical coach note before rejecting a future submission.');
  }

  if (trimmedNote.length > maxCoachNoteLength) {
    return invalid('Keep coach notes concise, respectful, and focused on useful training feedback.');
  }

  return valid('Coach note is concise and focused on useful training feedback.');
}
