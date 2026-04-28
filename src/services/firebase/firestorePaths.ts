export function clubPath(clubId: string): string {
  return `clubs/${clubId}`;
}

export function squadsCollectionPath(clubId: string): string {
  return `${clubPath(clubId)}/squads`;
}

export function squadPath(clubId: string, squadId: string): string {
  return `${squadsCollectionPath(clubId)}/${squadId}`;
}

export function athletesCollectionPath(clubId: string): string {
  return `${clubPath(clubId)}/athletes`;
}

export function athletePath(clubId: string, athleteId: string): string {
  return `${athletesCollectionPath(clubId)}/${athleteId}`;
}

export function questsCollectionPath(clubId: string): string {
  return `${clubPath(clubId)}/quests`;
}

export function questPath(clubId: string, questId: string): string {
  return `${questsCollectionPath(clubId)}/${questId}`;
}

export function submissionsCollectionPath(clubId: string): string {
  return `${clubPath(clubId)}/submissions`;
}

export function submissionPath(clubId: string, submissionId: string): string {
  return `${submissionsCollectionPath(clubId)}/${submissionId}`;
}

export function rewardResultsCollectionPath(clubId: string): string {
  return `${clubPath(clubId)}/rewardResults`;
}

export function rewardResultPath(clubId: string, rewardResultId: string): string {
  return `${rewardResultsCollectionPath(clubId)}/${rewardResultId}`;
}

export function athleteProgressCollectionPath(clubId: string): string {
  return `${clubPath(clubId)}/athleteProgress`;
}

export function athleteProgressPath(clubId: string, athleteId: string): string {
  return `${athleteProgressCollectionPath(clubId)}/${athleteId}`;
}

export function squadProgressCollectionPath(clubId: string): string {
  return `${clubPath(clubId)}/squadProgress`;
}

export function squadProgressPath(clubId: string, squadId: string): string {
  return `${squadProgressCollectionPath(clubId)}/${squadId}`;
}
