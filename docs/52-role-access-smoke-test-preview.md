# Role Access Smoke Test Preview

## What Was Added

Step 45 adds a developer-only role access smoke test preview for DRIVE: Winter Quest:

- `src/services/auth/roleAccessSmokeTest.ts` contains pure helpers that evaluate the current session against the existing route access rules.
- `src/components/game/RoleAccessSmokeTestPanel.tsx` presents current session status, role claims, scope fields, and access decisions for each app area.
- `src/screens/dev/RoleAccessSmokeTestScreen.tsx` reads the current auth session through `useDriveAuth()` and renders the smoke test panel.
- `app/dev/role-access-smoke-test.tsx` exposes the developer preview route at `/dev/role-access-smoke-test`.

The existing `/dev/role-access` preview now notes that it uses static fake sessions, while `/dev/role-access-smoke-test` uses the current signed-in session.

## Why This Preview Exists

DRIVE now has a Firebase test user with coach custom claims available for local verification. Before protected routes are enabled, the team needs a safe way to inspect what the current signed-in session would be expected to access under the central DRIVE route access rules.

This helps confirm whether coach, athlete, incomplete, unauthenticated, and future admin-style claim states line up with the intended role boundaries before any route enforcement exists.

## Why This Does Not Enable Protected Routes

The smoke test is diagnostic only. It calls pure route access helpers and displays the resulting preview decisions. It does not wrap routes, block children, replace navigation state, redirect users, hide screens, or change Expo Router behaviour.

Protected route enforcement still needs a later explicit step because it affects junior athlete data handling, unauthorised states, Firestore and Storage access, and safeguarding review.

## Why It Does Not Redirect Or Hide Screens

Preview routes must remain available while DRIVE is still being reviewed and hardened. A session that is unauthenticated, incomplete, or not authorised for a future area may show a blocked future decision, but screens remain visible.

No route is unlocked when authenticated, and no route is hidden when unauthenticated.

## How It Helps Confirm Access Decisions

The preview evaluates these app areas:

- `public`
- `athlete`
- `coach`
- `dev`
- `adminFuture`

Coach claims should show future coach access when the session has complete club and squad scope. Coach claims should not grant athlete own-data access.

Athlete claims should show future athlete access only in the linked athlete context. Athlete claims should not grant coach access.

Unauthenticated or incomplete sessions should not be treated as authorised for future protected athlete or coach areas.

Public and developer preview areas remain available for development review.

## Why `adminFuture` Remains Future Only

`adminFuture` is still planning language only. It must not become a broad bypass into athlete data, coach areas, admin tooling, or missing-claims fallbacks.

The smoke test keeps `adminFuture` blocked as a future app area and expects only public and developer preview areas to remain available around that role state.

## Why Firestore And Provider Switching Stay Out Of Scope

This preview does not read Firestore, write Firestore, call repositories, switch the repository provider, initialise Firebase repositories, or touch PM5 evidence storage.

The repository provider remains mock backed for product screens. Firebase repository mode remains future controlled testing only and must not be inferred from this diagnostic.

## What Future Agents Must Not Infer

Future agents must not infer from this preview that:

- protected routes, redirects, or hidden preview routes are enabled
- public signup or account creation is approved
- the client app can set Firebase custom claims
- `apply:claims` should be run
- `DRIVE_CLAIMS_LIVE_APPLY=true` should be set
- Firestore reads or writes are approved
- the app should switch to Firebase repository mode
- Firebase Storage upload or real PM5 upload exists
- submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written
- `adminFuture` is a broad bypass role

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected route enforcement, auth redirects, hiding preview routes, Firestore reads, Firestore writes, repository provider switching, audit record writes, running `apply:claims`, setting new Firebase custom claims, enabling `DRIVE_CLAIMS_LIVE_APPLY`, Firebase Storage upload, PM5 upload, submit actions, approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
