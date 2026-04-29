# Repository Provider Mode Foundation

## What Was Added

Step 30 adds a safe repository provider mode foundation for DRIVE: Winter Quest:

- `src/services/repositories/repositoryProviderMode.ts` reads `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER` and accepts only `mock` or `firebase`.
- `src/services/repositories/firebase/firebaseRepositoryProvider.ts` groups the existing Firebase read repositories into the screen-facing provider shape.
- `src/services/repositories/repositoryProvider.ts` now chooses the active provider centrally and exposes provider status.

The foundation does not initialise Firebase, read Firestore, write Firestore, upload files, submit evidence, approve evidence, reject evidence, calculate rewards, or write progress.

## Why Mock Remains The Default

Mock remains the default because DRIVE is still a preview shell. Missing `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER` means `mock`, and invalid values also fall back to `mock`.

This protects product review routes from requiring Firebase setup and avoids accidentally connecting junior athlete preview screens to live data.

## How The Provider Env Works

`EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=mock` keeps the app on the mock repository provider.

`EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=firebase` requests the Firebase read repository provider for future controlled testing only. The provider returns Firebase repositories only when that value is exactly `firebase` and Firebase config appears complete.

Any other value is treated as invalid and falls back to mock.

## Why Firebase Mode Is Explicit Only

Firebase mode is not enabled by default because it changes the data boundary from local preview records to future live repository reads. That must be deliberate and reviewable.

The mode helper is pure environment configuration. It does not import Firestore helpers, initialise Firebase, run reads, or create writes.

## Why Preview Needs No Firebase Project

Normal preview mode still uses mock repositories. A reviewer can open athlete, coach, auth, and developer preview routes without a real Firebase project or real Firebase environment values.

If Firebase mode is requested without complete Firebase config, app startup does not crash. The central provider falls back to mock and exposes status so future debugging can explain the fallback.

## Why Screens Still Use The Provider

Product screens must continue to use `getRepositoryProvider()` and repository contracts. They must not import Firebase repositories, Firebase SDKs, Firestore helpers, or Storage helpers directly.

Central provider selection keeps future live reads reviewable in one place and prevents Firebase assumptions from leaking into athlete or coach UI.

## Why Trusted Writes Remain Separate

Trusted reward and progress write repositories remain outside the screen-facing provider. Athlete-facing UI must not write XP, badges, attributes, squad mission progress, River Map progress, Boathouse progress, or reward results.

Those writes belong to later trusted workflows after coach verification and reward processing have been explicitly designed.

## Why Submission Writes Remain Out Of Scope

The screen-facing provider still exposes only `submissionReadRepository`. It does not expose draft saving, final submit, PM5 path writes, coach approve, coach reject, status updates, or coach notes.

Submission writes affect private PM5 evidence, athlete reflections, coach authority, and reward eligibility. They need a later approved workflow step.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firebase is the default provider.
- Product screens are ready for live Firestore data.
- Public signup or account creation is approved.
- Protected routes, auth redirects, or hidden preview routes are enabled.
- Firestore writes are approved.
- Firebase Storage upload, image picking, or real PM5 upload exists.
- Real submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from UI.
- Submission writes may be added to the screen-facing provider without explicit approval.

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected route enforcement, auth redirects, hiding preview routes, Firestore writes, Firebase Storage upload, image picking, real PM5 upload, real submit actions, real approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, public profiles, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
