# Firestore Schema

## Status

This is a planning document for the future Firebase implementation. Step 1 must not add Firebase code, initialise Firebase, or install Firebase packages.

The schema below is an initial shape for DRIVE: Winter Quest and should be refined when implementation begins.

Do not overbuild the schema at this stage. Treat this as planning guidance for future implementation.

## Ownership And Audit Fields

Key records should include ownership and audit fields where appropriate:

- `clubId`
- `squadId`
- `athleteId`
- `createdByUserId`
- `createdAt`
- `updatedAt`

Use these fields to make permissions, squad boundaries, and support investigations easier to reason about.

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

- `clubId`
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
- `createdByUserId`
- `status`
- `createdAt`
- `updatedAt`

### `submissions`

Stores athlete evidence uploads and reflections.

Suggested fields:

- `questId`
- `clubId`
- `squadId`
- `athleteId`
- `createdByUserId`
- `pm5PhotoPath`
- `reflection`
- `status`: `draft`, `submitted`, `verified`, or `rejected`
- `submittedAt`
- `verifiedAt`
- `verifiedByCoachId`
- `rejectionReason`
- `rewardResultId`

Status guidance:

- `draft`: started by the athlete but not yet submitted for coach review.
- `submitted`: sent by the athlete and waiting for coach review.
- `verified`: approved by a coach and eligible for reward processing.
- `rejected`: reviewed by a coach but not accepted as valid evidence.

### `rewardResults`

Stores reward calculations for verified submissions.

Suggested fields:

- `submissionId`
- `clubId`
- `squadId`
- `questId`
- `athleteId`
- `xpAwarded`
- `attributeDeltas`
- `badgesUnlocked`
- `squadMissionContribution`
- `riverMapDelta`
- `boathouseDelta`
- `explanation`
- `createdByUserId`
- `createdAt`
- `updatedAt`

### `athleteProgress`

Stores current progress by athlete.

Suggested fields:

- `athleteId`
- `clubId`
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

- `clubId`
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

PM5 photo paths must be private and scoped by squad and submission.

## Security Direction

Future Firebase rules must enforce:

- Athletes can create their own submissions.
- Athletes cannot verify submissions.
- Athletes cannot write `rewardResults` directly.
- Athletes cannot update `athleteProgress` directly.
- Coaches can verify submissions for their own squads.
- Rewards can only be created through trusted verification workflow.
- Users cannot access squad data unless they belong to that squad.

## Reward Integrity

Reward results must reference the verified submission that caused them. This makes progress auditable and reduces disputes.

Coach verification should create an auditable trail showing who verified or rejected the submission, when they did it, and any practical reason or note they added.

Do not let client screens write arbitrary XP, attributes, badge unlocks, River Map progress, or Boathouse progress.
