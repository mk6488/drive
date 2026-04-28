export type ClubScopedId = string;
export type YearGroup = 'year-9' | 'year-10' | 'year-11' | 'year-12' | 'year-13';
export type AgeBand = 'u15' | 'u16' | 'u17' | 'u18';

export interface Athlete {
  id: ClubScopedId;
  clubId: string;
  squadId: string;
  displayName: string;
  yearGroup?: YearGroup;
  ageBand?: AgeBand;
  createdAt: string;
  updatedAt: string;
}
