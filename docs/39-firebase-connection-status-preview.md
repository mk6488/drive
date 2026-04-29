# Firebase Connection Status Preview

## What Was Added

Step 32 adds a developer-only Firebase connection status preview for DRIVE: Winter Quest:

- `src/services/firebase/firebaseConnectionStatus.ts` provides safe status helpers for Firebase config completeness, explicit Firebase app initialisation checks, and repository provider boundary reporting.
- `src/components/game/FirebaseConnectionStatusPanel.tsx` presents the status without importing Firebase or calling repositories.
- `src/screens/dev/FirebaseConnectionStatusPreviewScreen.tsx` exposes a local button that runs the Firebase app initialisation check only when pressed.
- `app/dev/firebase-status.tsx` exposes the developer route at `/dev/firebase-status`.

## Why This Preview Exists

DRIVE now has a real Firebase project available locally, but normal app preview mode must remain mock backed until a later explicit step chooses otherwise.

This preview helps developers confirm whether local Firebase configuration appears complete and whether the Firebase app boundary can initialise, without connecting athlete, coach, or developer preview routes to live data.

## Why It Checks Config And App Initialisation Only

Firebase configuration and app initialisation are infrastructure checks. They are useful for confirming local setup, but they do not exercise product workflows.

The app initialisation check only runs after the developer presses the local preview button. Missing Firebase config is reported as status information and must not crash app startup.

## Why It Does Not Read Or Write Firestore

Firestore reads and writes involve private junior athlete data, coach verification, quest records, submissions, rewards, and progress. This preview is not a repository test and must not prove live data access.

The preview does not call Firestore repositories, document reads, collection reads, queries, listeners, writes, updates, or deletes.

## Why It Does Not Test Storage Upload

PM5 photos are private squad training evidence. Storage upload needs approved auth, ownership checks, Storage paths, Firestore linkage, error handling, and coach verification workflow decisions.

This preview does not initialise Storage for upload, pick images, upload files, download files, delete files, or test Storage rules.

## Why It Does Not Test Auth Sign In

Auth sign-in affects session state, role claims, junior privacy, route access, and future protected areas. This preview is only a connection status screen.

It does not sign users in, create users, add public signup, create accounts, inspect profiles from Firestore, redirect users, or grant access to athlete or coach areas.

## Why The Repository Provider Remains Mock Backed

Mock remains the default provider for normal preview mode. This preview reports whether the active repository provider is still mock backed, but it does not call `getRepositoryProvider()`, change provider selection, or connect product screens to Firebase repositories.

Firebase mode remains future controlled testing only and is not enabled by default.

## Why Normal Mock Preview Needs No Firebase Project

Reviewers can still open the app in mock-backed preview mode without a Firebase project or real Firebase environment values.

Local Firebase config may now exist for infrastructure testing, but it is not required for normal athlete, coach, auth, or developer preview routes. Missing config should remain visible only in dedicated status or Firebase boundary checks.

## What Future Agents Must Not Infer

Future agents must not infer from this preview that:

- Firebase is the default repository provider.
- Product screens are connected to live Firestore data.
- Firestore reads or writes are being tested.
- Firebase Storage upload or real PM5 evidence upload exists.
- Auth sign-in, public signup, or account creation is part of this route.
- Protected routes, redirects, or hidden preview routes are enabled.
- Real submit, approve, reject, reward, or progress workflows exist.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from UI.
- Firebase config values should be committed.

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected route enforcement, auth redirects, hiding preview routes, Firestore reads, Firestore writes, repository provider switching, Firebase Storage upload, image picking, real PM5 upload, real submit actions, real approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, public profiles, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
