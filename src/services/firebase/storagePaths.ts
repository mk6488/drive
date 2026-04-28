const unsafeFileNameCharacters = /[^A-Za-z0-9._-]+/g;
const repeatedSeparators = /-+/g;

export function normalisePm5EvidenceFileName(fileName: string): string {
  const safeName = fileName
    .trim()
    .replace(unsafeFileNameCharacters, '-')
    .replace(repeatedSeparators, '-')
    .replace(/^-+|-+$/g, '');

  return safeName || 'pm5-evidence';
}

export function pm5EvidencePath(clubId: string, submissionId: string, fileName: string): string {
  return `clubs/${clubId}/submissions/${submissionId}/pm5/${normalisePm5EvidenceFileName(fileName)}`;
}
