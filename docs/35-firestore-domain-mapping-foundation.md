# Firestore Domain Mapping Foundation

## What Was Added

Step 28 adds a pure Firestore domain mapping foundation for DRIVE: Winter Quest:

- `src/services/firebase/firestoreDocuments.ts` defines planning-level Firestore document shapes for clubs, squads, athletes, quests, submissions, reward results, athlete progress, and squad progress.
- `src/services/firebase/firestoreMappers.ts` defines pure helpers that map those document shapes into the existing DRIVE domain types.
- `src/services/firebase/index.ts` exports the safe document and mapper foundation alongside the existing Firebase service boundary helpers.

These helpers do not read Firestore, write Firestore, create repositories, call repositories, switch the repository provider, or connect screens to live Firebase data.

## Why Mapping Helpers Exist Before Repositories

Future Firestore repositories will need one consistent place to translate provider-specific document shapes into DRIVE domain types. Adding mapping helpers before repositories keeps that translation reviewable before live data access exists.

This protects the product model from quiet field-name drift. Screens and repository contracts can keep using domain language while future Firestore repositories handle document mapping inside the service boundary.

## Submission Review Fields

Submission review fields remain:

- `reviewedByUserId`
- `reviewedAt`
- `coachNote`

Those names match the existing domain model and Firestore schema guidance. They show who reviewed the submission, when review happened, and the practical coach note attached to verification or rejection.

The mapping foundation deliberately does not introduce `verifiedByCoachId`, `verifiedAt`, `coachNotes`, or `rejectionReason`.

## Submission Status

Submission status remains only:

- `draft`
- `submitted`
- `verified`
- `rejected`

`pending` is not a domain status because `submitted` already means the athlete has sent evidence and is waiting for coach review. Adding another waiting state would duplicate meaning and increase inconsistency risk across screens, repositories, rules, and future workflows.

## Submission Draft Mapper Boundary

The submission draft mapper is intentionally limited to future athlete-side draft or submit document data. Its status type is limited to `draft` or `submitted`.

It excludes `reviewedByUserId`, `reviewedAt`, `coachNote`, and `rewardResultId` because athlete-facing code must not create reviewed submissions, mark work as verified or rejected, or attach reward outcomes. `verified` and `rejected` belong to future trusted coach review workflows only, behind a separate mapper or command boundary.

## Why Firebase Timestamp Is Not Imported

The mapper foundation uses `FirestoreDateValue = string | number | Date | { toDate: () => Date }` instead of importing Firebase `Timestamp`.

This keeps the helpers pure and provider-light. Future repositories may pass Firestore timestamp-like values into the mappers, but the mapping file itself does not depend on Firebase SDK types and does not initialise or access Firestore.

## Screen Boundary

Screens must not import these mappers directly. Screens should stay UI only and continue to use repository contracts or services.

Future Firestore repositories may use these mappers behind the repository boundary. That keeps Firebase document assumptions in infrastructure code instead of scattering them through athlete, coach, auth, or developer preview screens.

## Repositories Remain Out Of Scope

This step does not add Firestore repositories, collection reads, document reads, queries, listeners, writes, submit actions, approve actions, reject actions, or provider selection.

The repository provider remains mock backed. Future repository work needs a separate approved step because it affects private junior training data, coach authority, submission lifecycle rules, and reward integrity.

## Reward And Progress Writes

Reward results, athlete progress, squad mission progress, River Map progress, and Boathouse progress must remain trusted future workflows.

The mapper foundation can read trusted reward and progress document shapes into domain types, but it does not create reward result write helpers. Future writes must happen only after coach verification through an approved trusted workflow, not from athlete-facing UI or screen-level actions.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firestore repositories exist.
- The app reads from Firestore.
- The app writes to Firestore.
- The repository provider should switch away from mocks.
- Firebase Storage upload exists.
- PM5 upload, image picking, submit, approve, or reject workflows exist.
- Reward calculation exists.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from UI.
- Public signup, account creation, protected routes, redirects, or hidden preview routes are approved.
- `pending` is a valid submission status.

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected route enforcement, auth redirects, hiding preview routes, Firestore repositories, Firestore reads, Firestore writes, repository provider switching, Firebase Storage upload, image picking, real PM5 upload, real submit actions, real approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
