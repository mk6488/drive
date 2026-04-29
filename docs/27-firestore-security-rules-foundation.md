# Firestore Security Rules Foundation

## What Was Added

Step 20 adds a planning-level Firestore foundation for DRIVE: Winter Quest:

- `firestore.rules` defines intended client access boundaries for future club-scoped Firestore data.
- `firestore.indexes.json` is a valid minimal indexes placeholder.
- `firebase.json` points only at the Firestore rules and indexes files.
- `src/services/firebase/firestorePaths.ts` adds pure path builder helpers for the intended Firestore document and collection paths.

This step does not connect Firestore to the app, add repositories, switch the repository provider, or add any app reads or writes.

## Why Rules Exist Before Repositories

DRIVE handles junior athlete training evidence, coach judgement, and reward-sensitive progress. Drafting the rules before real Firestore repositories makes the privacy and role posture explicit before any live data path exists.

The rules are a foundation for future implementation, not proof that authentication, repository mapping, or trusted workflows are complete. Future Firebase repositories must fit inside these boundaries rather than weakening them to make screens easier to wire.

## Intended Collection Paths

The Firestore foundation is club scoped:

- `clubs/{clubId}`
- `clubs/{clubId}/squads/{squadId}`
- `clubs/{clubId}/athletes/{athleteId}`
- `clubs/{clubId}/quests/{questId}`
- `clubs/{clubId}/submissions/{submissionId}`
- `clubs/{clubId}/rewardResults/{rewardResultId}`
- `clubs/{clubId}/athleteProgress/{athleteId}`
- `clubs/{clubId}/squadProgress/{squadId}`

The matching TypeScript helpers in `src/services/firebase/firestorePaths.ts` return strings for these paths only. They import no Firebase APIs and perform no reads or writes.

## Athlete Privacy

Unauthenticated users cannot read private training data. Athlete access is intended to be scoped by future auth claims such as `clubId`, `squadIds`, and `linkedAthleteId`.

Athletes may only read athlete-facing records that belong to their club, squad context, or linked athlete record. They must not read other athletes' private submissions, evidence, reward records, or progress records.

The foundation deliberately excludes public athlete profile access, public training evidence galleries, and public rankings because DRIVE is for junior athletes and must avoid unnecessary exposure or comparison.

## Coach Access

Coaches are intended to read squad and athlete training evidence only within their authorised club and squad scope. Coach access is based on future role and squad claims, not global access.

The rules allow future coaches to create quest documents for their assigned squads and to review submitted athlete evidence for those squads. Coach review fields follow the existing submission domain model: `reviewedByUserId`, `reviewedAt`, and `coachNote`.

Coach review is limited to submitted submissions. The coach client may change the submission status to `verified` or `rejected` and add review audit fields, but it must keep identity fields unchanged and must not write reward results or progress directly.

## Submission Audit Boundary

Athletes may only edit their own draft submissions. Draft edits are limited to PM5 evidence path, reflection, status, `submittedAt`, and `updatedAt`.

Submitting evidence moves the record into the awaiting coach review state. Once a submission is `submitted`, `verified`, or `rejected`, athlete edits are locked so the PM5 evidence and reflection remain stable for coach review and future audit trails.

## Reward And Progress Writes

Athletes cannot write `rewardResults`, `athleteProgress`, or `squadProgress`. Coaches also cannot write those records from client UI during review. This protects the DRIVE rule that XP, badges, attributes, squad mission progress, River Map progress, and Boathouse progress are earned only after coach verified execution quality.

Reward and progress writes are expected to come later from trusted server workflows, such as Cloud Functions or another server-side process using appropriate privileged credentials. Client UI must not be able to grant arbitrary progress.

## Future Role Assignment Audit Records

Future trusted role assignment may need a server-only audit collection that records who authorised a role assignment, why it was authorised, which user was targeted, and what narrow club or squad scope was granted.

Step 37 does not add that collection, does not write audit records, and does not loosen Firestore rules. Any future audit record storage needs a later explicit server-side rules and workflow step.

## Deliberately Absent Features

This foundation does not add public profiles, public rankings, public leaderboards, direct messaging, social feeds, or public sharing rules. Those features are absent because they would increase safeguarding risk and are outside the DRIVE: Winter Quest MVP.

Firebase Storage rules are also absent. PM5 upload and private evidence storage remain separate future work.

## Repository Provider Status

The repository provider remains mock backed. No Firebase repositories were added, no provider selection was changed, and no screen imports Firestore. The app is still a preview shell with Firebase app initialisation available only as infrastructure foundation from the previous step.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firebase Auth has been added.
- Login, signup, or protected routes exist.
- Firestore repositories exist.
- The app reads from Firestore.
- The app writes to Firestore.
- Firebase Storage upload exists.
- PM5 upload is implemented.
- Real submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results or progress can be written from athlete UI.
- Admin is a broad bypass role.
- Public profiles, public rankings, leaderboards, messaging, or social features are approved.

## Deliberately Out Of Scope

This step intentionally excludes real authentication, repository implementation, live Firestore data access, Storage upload, deploy configuration, emulator setup, server workflows, reward calculation, progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
