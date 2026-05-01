# Repository Read Smoke Test Preview

## What Was Added

Step 51 adds a developer-only repository read smoke test preview for DRIVE: Winter Quest:

- `src/services/repositories/repositoryReadSmokeTest.ts` runs read-only checks through the active repository provider.
- `src/components/game/RepositoryReadSmokeTestPanel.tsx` presents provider mode, fallback status, and each read result.
- `src/screens/dev/RepositoryReadSmokeTestScreen.tsx` runs the smoke test only after a developer presses the button.
- `app/dev/repository-read-smoke-test.tsx` exposes the developer preview route at `/dev/repository-read-smoke-test`.

The existing repository provider status preview now points developers to the separate read smoke test route.

## Why This Preview Exists After Seed Verification

Step 50 verified from the trusted functions workspace that the fake Firestore seed documents exist for:

- `example-club`
- `example-j15-squad`
- `example-athlete`

That server-side verification proves the expected fake documents exist at planned paths. This preview is the next safe client-side diagnostic: it checks whether the app can load the expected fake records through the active repository provider boundary when Firebase mode is intentionally configured.

## Why It Reads Through The Repository Provider Only

Screens and developer previews must depend on repository contracts, not Firebase implementation files. The smoke test service calls `getRepositoryProvider()` and existing read-only repository methods, then returns a structured report.

This keeps Firebase selection centralised and prevents product screens from learning Firestore paths, Firebase SDK details, or repository implementation names.

## Why Screens Must Not Import Firebase Repositories Directly

Direct Firebase repository imports from screens would bypass provider mode checks and make future live data access harder to review. DRIVE handles junior athlete training evidence, coach verification context, and reward-sensitive progress, so live data access must stay centralised and intentional.

Presentational components receive a report object only. They do not call repositories, import Firebase, change provider mode, or run data access.

## Why This Does Not Write Firestore

The smoke test uses read-only methods only:

- athlete lookup
- squad lookup
- quest lookup
- submission lookup
- athlete progress lookup
- squad mission progress lookup

It does not call Firestore writes, deletes, batch commits, transactions, submit actions, approve actions, reject actions, reward writes, athlete progress writes, or squad progress writes.

## Why This Does Not Test Storage Or PM5 Upload

The preview does not initialise Firebase Storage, pick images, upload files, download files, delete files, or link PM5 evidence to Firestore records.

PM5 upload remains a separate future workflow because it affects private squad training evidence, ownership checks, user-facing errors, coach verification, and Storage rules.

## Why The Provider Remains Mock By Default

Mock remains the safe default. Missing or invalid `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER` still means mock mode, and Firebase mode only activates when `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=firebase` is set intentionally and Firebase config appears complete.

This preview does not change environment values, does not switch provider mode, and does not make Firebase the default for product screens.

## How This Helps Future Firebase Mode Testing

When Firebase mode is intentionally enabled in a local development environment, this route can confirm whether the fixed fake seed records are readable through the same provider boundary that screens use.

That helps test repository wiring without adding product workflows, exposing broad Firestore reads, or creating new data.

## What Future Agents Must Not Infer

Future agents must not infer from this preview that:

- Firebase is the default repository provider.
- Product workflows are ready for live Firestore data.
- Screens may import Firebase repositories directly.
- Firestore writes, deletes, or mutations are approved.
- Firebase Storage upload or PM5 upload exists.
- Submit, approve, or reject actions exist.
- Reward calculation exists.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from UI.
- Real junior data or real club data may be created for smoke tests.
- Broad collection scans are acceptable.
- Provider switching should happen inside screens.

## Deliberately Out Of Scope

This step intentionally excludes deployment, Firestore writes, Firestore deletes, seed mutation, running `apply:seed`, running `apply:claims`, setting custom claims, changing repository provider defaults, changing route protection defaults, Firebase Storage upload, image picking, real PM5 upload, submit actions, approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, public profiles, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
