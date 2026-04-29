# Repository Provider Status Preview

## What Was Added

Step 31 adds a developer-only repository provider status preview for DRIVE: Winter Quest:

- `src/components/game/RepositoryProviderStatusPanel.tsx` presents the current provider status.
- `src/screens/dev/RepositoryProviderStatusPreviewScreen.tsx` calls `getRepositoryProviderStatus()` and explains the preview boundary.
- `app/dev/repository-provider.tsx` exposes the developer route at `/dev/repository-provider`.

## Why The Status Preview Exists

The preview exists so future agents and reviewers can see which repository provider mode has been requested and which provider mode is active without inspecting environment variables or wiring product screens to live data.

This is especially important while Firebase is being introduced carefully. The app now has foundations for Firebase config, lazy service helpers, read-only Firebase repositories, and central provider mode selection, but the product still needs clear visual confirmation that normal preview usage remains safe.

## Why Mock Remains The Default

Mock remains the default because DRIVE is still a preview shell. If `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER` is missing or invalid, the provider status reports mock mode and the active provider stays mock backed.

This keeps athlete, coach, auth, and developer preview routes available without requiring a Firebase project. It also avoids accidentally connecting junior athlete preview screens to future live data.

## Why Firebase Mode Is Future Controlled Testing Only

Firebase mode is only for later intentional repository testing. It must be requested explicitly with `EXPO_PUBLIC_DRIVE_REPOSITORY_PROVIDER=firebase`, and it only becomes active when Firebase config appears complete.

This step does not make Firebase the default. It does not add public signup, account creation, protected routes, auth redirects, hidden preview routes, live PM5 upload, real submit actions, coach approve or reject actions, reward calculation, or progress writes.

## Why This Screen Does Not Read Or Write Firestore

The preview calls `getRepositoryProviderStatus()` only. It does not call `getRepositoryProvider()`, Firestore repositories, Firestore service helpers, document reads, queries, listeners, or write APIs.

Firestore reads and writes affect private junior athlete data, coach verification, and reward-sensitive progress. This route is only a status display, so it must not prove or exercise live data access.

## Why This Screen Does Not Test Storage

The preview does not initialise Firebase Storage, build image picking, upload PM5 evidence, download files, or test Storage rules.

PM5 photos are private squad training evidence and remain outside this step. Storage workflows need later approved implementation around auth, ownership, Firestore linkage, user-facing errors, and coach verification.

## Why No Firebase Project Is Required For Preview Mode Yet

Normal preview mode remains mock backed. A reviewer can open `/dev/repository-provider` with no Firebase environment values and still see provider status. Missing Firebase config is reported as status information rather than treated as an app startup failure.

If Firebase mode is requested without complete config, the provider status reports mock fallback so the app remains inspectable.

## What Future Agents Must Not Infer

Future agents must not infer from this preview that:

- Firebase is the default provider.
- Product screens are connected to live Firestore data.
- Firestore reads or writes are being exercised by this route.
- Firebase Storage upload or PM5 evidence upload exists.
- Public signup, account creation, protected routes, redirects, or hidden preview routes are approved.
- Real submit, approve, reject, reward, or progress workflows exist.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from UI.
- Provider behaviour should be changed outside a later explicit step.

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected route enforcement, auth redirects, hiding preview routes, Firestore reads, Firestore writes, Firebase Storage upload, image picking, real PM5 upload, real submit actions, real approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, public profiles, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
