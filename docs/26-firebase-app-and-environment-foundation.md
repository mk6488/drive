# Firebase App And Environment Foundation

## What Was Added

Step 19 adds a safe Firebase app and environment boundary for DRIVE: Winter Quest:

- The official Firebase JavaScript SDK is installed.
- `.env.example` documents the required `EXPO_PUBLIC_FIREBASE_*` variable names with empty placeholders only.
- `src/services/firebase/firebaseConfig.ts` reads Expo public Firebase environment values and exposes completeness helpers.
- `src/services/firebase/firebaseApp.ts` exposes controlled Firebase app initialisation through `getFirebaseApp()`.
- `src/services/firebase/index.ts` exports only the safe config and app helpers.

## Why Firebase App Setup Is Separate

Firebase app initialisation is infrastructure. It is deliberately separated from Firebase Auth, Firestore, and Firebase Storage so future work cannot accidentally turn environment setup into real product workflows.

This foundation only prepares the app instance boundary. It does not create authentication state, database repositories, file upload paths, coach verification workflows, reward processing, or progress writes.

## Why `.env.example` Uses Placeholders Only

`.env.example` exists to show developers which Expo public environment variables will eventually be needed. It contains empty values only because real Firebase project credentials must not be committed.

Real credentials belong in local environment files such as `.env` or `.env.local`, which remain ignored by git.

## Why Real Credentials Must Not Be Committed

Firebase project settings identify live infrastructure. Committing real values would make it easier to copy project configuration into the wrong environment and would weaken the boundary between preview code and future live services.

Future agents must keep real values out of source control and avoid adding secrets to docs, examples, commits, or generated files.

## Why The App Remains Mock Backed

The repository provider remains mock backed. This step does not update provider selection, add Firebase repositories, or connect screens to live data.

Keeping the app mock backed protects the existing preview behaviour while the product boundaries are still being built. Future Firebase repositories must be added only in a later explicit step and must preserve the existing repository contracts.

## Why Screens Must Not Import Firebase Directly

Screens are UI only. Firebase access must stay inside repositories or services so product workflows remain testable, reviewable, and aligned with the coach verified reward model.

Screens must not import Firebase SDKs, initialise Firebase, read Firestore, write Firestore, upload PM5 evidence, or write reward and progress records directly.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firebase Auth is implemented.
- login or signup exists.
- protected routes exist.
- Firestore repositories exist.
- Firebase Storage upload exists.
- repository provider selection can switch to Firebase.
- real PM5 upload, submit, approve, or reject actions exist.
- reward calculation or trusted reward writes exist.
- athlete, squad, River Map, or Boathouse progress writes exist.
- screens may import Firebase directly.

## Deliberately Out Of Scope

This step intentionally excludes:

- real authentication
- login and signup
- protected routes
- Firestore reads or writes
- Firebase repositories
- Firebase Storage upload
- PM5 upload
- real submit actions
- real coach approve or reject actions
- reward calculation
- reward result writes
- athlete progress writes
- squad progress writes
- Boathouse or River Map progress writes
- leaderboards and public rankings
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
