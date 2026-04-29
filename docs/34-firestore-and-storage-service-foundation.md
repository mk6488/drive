# Firestore And Storage Service Foundation

## What Was Added

Step 27 adds lazy Firebase service boundary helpers for DRIVE: Winter Quest:

- `src/services/firebase/firebaseFirestore.ts` exposes `getDriveFirestore()`.
- `src/services/firebase/firebaseStorage.ts` exposes `getDriveStorage()`.
- `src/services/firebase/index.ts` exports the safe Firebase config, app, Auth, Firestore, Storage, Firestore path, and Storage path helpers only.

These helpers initialise Firestore or Storage only when explicitly called. No product screen calls them in this step.

## Why Firestore And Storage Helpers Are Separated

Firestore and Firebase Storage support different future responsibilities. Firestore will hold private club, squad, quest, submission, reward, and progress records. Storage will hold private PM5 evidence files.

Keeping the helpers separate makes each service boundary easy to review and prevents future PM5 evidence work from being mixed with Firestore data access or reward-sensitive records.

## Why Helpers Are Lazy

Local preview builds may not have real Firebase environment values. Lazy helpers avoid initialising Firestore or Storage during app startup, which keeps the mock-backed preview usable while Firebase infrastructure is still being built.

If a future service explicitly asks for Firestore or Storage without complete Firebase config, the helper raises a developer-facing configuration error at that boundary.

## Why Missing Firebase Config Must Not Crash App Startup

The current app is still a preview shell. Missing Firebase config should not stop reviewers from opening mock-backed athlete, coach, auth, or developer preview routes.

Missing config must also never grant access, create fallbacks to live data, or silently switch behaviour. It should stay visible only when a Firebase service helper is deliberately called.

## Why Firestore Repositories Are Still Out Of Scope

This foundation does not add Firestore repositories, collection reads, document reads, writes, queries, listeners, or repository provider switching.

Repository implementation affects private junior athlete data, coach permissions, submission status, reward integrity, and auditability. That work needs a later explicit step that preserves the existing repository contracts and security rules.

## Why PM5 Upload Is Still Out Of Scope

Storage initialisation is not an upload workflow. This step does not add image picking, file upload, file download, file delete, PM5 evidence submission, Firestore linkage, or submit actions.

Real PM5 upload needs approved auth, ownership checks, Storage path use, Firestore submission records, user-facing error handling, and coach verification flow decisions.

## Why Screens Must Not Import Firestore Or Storage Directly

Screens are UI only. They may display state and collect preview input, but they must not import Firebase SDKs or call Firestore or Storage directly.

Future Firestore and Storage access must stay in repositories or services so junior training data, PM5 evidence, and reward-sensitive workflows remain reviewable and testable.

## Why The Repository Provider Remains Mock Backed

The repository provider remains mock backed because this step adds service boundaries only. It does not connect product screens to live Firebase data, change provider selection, or introduce real persistence.

Keeping the app mock backed protects preview routes while Firebase boundaries, auth, rules, repositories, and workflow services are completed in separate approved steps.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firestore repositories exist.
- The app reads from Firestore.
- The app writes to Firestore.
- Firebase Storage upload exists.
- PM5 upload, image picking, or file download exists.
- The repository provider should switch away from mocks.
- Product screens may import Firebase SDKs directly.
- Real submit, approve, or reject actions exist.
- Reward calculation or trusted reward writes exist.
- Athlete progress, squad progress, River Map progress, or Boathouse progress can be written.
- Protected routes, auth redirects, public signup, or account creation are enabled.

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected route enforcement, auth redirects, Firestore repositories, Firestore reads, Firestore writes, repository provider switching, Storage uploads, Storage downloads, Storage deletes, image picking, real PM5 upload, real submit actions, real approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
