# Firestore Schema

## Status

This is a planning document for the future Firebase implementation. Step 1 must not add Firebase code, initialise Firebase, or install Firebase packages.

The schema below is an initial shape for DRIVE: Winter Quest and should be refined when implementation begins.

## Collections

### `users`

Stores account-level profile data.

Suggested fields:

- `displayName`
- `role`: `athlete`, `coach`, or later `admin`
- `clubId`
- `squadIds`
- `createdAt`
- `updatedAt`

### `squads`

Stores squad identity and membership context.

Suggested fields:

- `name`
- `clubId`
- `coachIds`
- `athleteIds`
- `activeWinterQuestId`
- `createdAt`
- `updatedAt`

### `quests`

Stores coach-created erg quests.

Suggested fields:

- `squadId`
- `title`
- `description`
- `sessionType`
- `targetPace`
- `targetRate`
- `durationOrDistance`
- `qualityFocus`
- `weekStartDate`
- `createdByCoachId`
- `status`
- `createdAt`
- `updatedAt`

### `submissions`

Stores athlete evidence uploads and reflections.

Suggested fields:

- `questId`
- `squadId`
- `athleteId`
- `pm5PhotoPath`
- `reflection`
- `status`: `pending`, `verified`, or `rejected`
- `submittedAt`
- `verifiedAt`
- `verifiedByCoachId`
- `rejectionReason`
- `rewardResultId`

### `rewardResults`

Stores reward calculations for verified submissions.

Suggested fields:

- `submissionId`
- `questId`
- `athleteId`
- `xpAwarded`
- `attributeDeltas`
- `badgesUnlocked`
- `squadMissionContribution`
- `riverMapDelta`
- `boathouseDelta`
- `explanation`
- `createdAt`

### `athleteProgress`

Stores current progress by athlete.

Suggested fields:

- `athleteId`
- `squadId`
- `xp`
- `level`
- `attributes`
- `badgeIds`
- `riverMapPosition`
- `boathouseContributions`
- `updatedAt`

### `squadMissions`

Stores shared squad goals.

Suggested fields:

- `squadId`
- `title`
- `description`
- `target`
- `progress`
- `status`
- `startsAt`
- `endsAt`
- `updatedAt`

### `storage`

PM5 photos should be stored in Firebase Storage, not directly in Firestore.

Suggested path:

- `squads/{squadId}/submissions/{submissionId}/pm5-photo`

## Security Direction

Future Firebase rules must enforce:

- Athletes can create their own submissions.
- Athletes cannot verify submissions.
- Coaches can verify submissions for their own squads.
- Rewards can only be created through trusted verification workflow.
- Users cannot access squad data unless they belong to that squad.

## Reward Integrity

Reward results should reference the verified submission that caused them. This makes progress auditable and reduces disputes.

Do not let client screens write arbitrary XP, attributes, badge unlocks, River Map progress, or Boathouse progress.
