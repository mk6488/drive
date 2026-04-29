# Firestore Read Repository Foundation

## What Was Added

Step 29 adds disconnected, read-only Firestore repository implementations for DRIVE: Winter Quest:

- `src/services/repositories/firebase/firestoreRepositoryHelpers.ts`
- `src/services/repositories/firebase/firebaseAthleteRepository.ts`
- `src/services/repositories/firebase/firebaseSquadRepository.ts`
- `src/services/repositories/firebase/firebaseQuestRepository.ts`
- `src/services/repositories/firebase/firebaseSubmissionReadRepository.ts`
- `src/services/repositories/firebase/firebaseRewardReadRepository.ts`
- `src/services/repositories/firebase/firebaseProgressReadRepository.ts`
- `src/services/repositories/firebase/index.ts`

These repositories use the existing lazy Firestore helper, Firestore path helpers, and Firestore document mappers. They are intentionally exported from their own Firebase repository folder only.

## Why Firebase Repositories Are Read Only For Now

This foundation exists so future live data can enter the app through repository contracts instead of product screens. It does not create real workflows.

The repositories only use Firestore read operations such as document reads and scoped queries. They do not save drafts, submit evidence, approve, reject, update status, write PM5 paths, attach coach notes, create reward results, or write athlete or squad progress.

## Why They Are Not Connected To The Provider Yet

`src/services/repositories/repositoryProvider.ts` remains mock backed. Switching the provider to Firebase would connect product screens to live data and would require settled auth, rules, loading, error, and preview decisions.

Keeping this step disconnected protects the existing preview mode. Missing Firebase config is still a developer setup issue only when a Firebase repository is deliberately called, not something that should crash mock-backed preview routes.

## Why Screens Must Not Import Firebase Repositories Directly

Screens must stay UI only. They should depend on the repository provider and stable repository contracts, not on Firebase implementation files.

Direct screen imports would bypass the provider boundary and make it harder to review junior athlete data access. Future provider selection must be deliberate and centralised, not scattered through athlete or coach screens.

## Submission Writes Remain Out Of Scope

The Firestore submission repository is read only. It does not include draft saving, final submit, verification, rejection, status updates, PM5 path writes, or coach note writes.

Submission write workflows affect private PM5 evidence, athlete reflection, coach authority, and reward eligibility. They need a later approved command or trusted workflow step.

## Reward And Progress Writes Remain Trusted Future Workflows

Reward and progress Firestore repositories are read only. They do not write `rewardResults`, `athleteProgress`, `squadProgress`, River Map progress, or Boathouse progress.

Those writes must remain trusted future workflows after coach verification so athletes cannot grant themselves XP, badges, attributes, squad mission progress, River Map movement, or Boathouse progress.

## Scoped Reads Only

Repository methods now require explicit club, squad, or athlete context where needed. The Firebase implementations avoid broad cross-club reads, public profile reads, public leaderboard reads, and public ranking patterns.

Submission reads are scoped by `clubId`, `squadId`, and `athleteId` so athlete-facing contexts do not gain methods that expose other athletes' private PM5 evidence or reflections.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- the repository provider should switch to Firebase
- product screens may import Firebase repositories directly
- public signup or account creation is approved
- protected routes, redirects, or hidden preview routes are enabled
- product screens are connected to Firestore
- Firestore writes are approved
- Firebase Storage upload, image picking, or real PM5 upload exists
- real submit, approve, or reject actions exist
- reward calculation exists
- reward or progress writes may run from client UI
- public profiles, leaderboards, messaging, social features, OCR, Concept2 API, live PM5 Bluetooth, Unity, or Godot are approved

## Deliberately Out Of Scope

This step intentionally excludes provider switching, screen wiring, auth enforcement, public signup, account creation, protected route enforcement, auth redirects, hiding preview routes, Firestore writes, submission writes, coach verification writes, reward calculation, reward result writes, athlete progress writes, squad progress writes, Storage upload, image picking, real PM5 upload, leaderboards, public profiles, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
