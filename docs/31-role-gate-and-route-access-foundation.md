# Role Gate And Route Access Foundation

## What Was Added

Step 24 adds a role gate and route access foundation for DRIVE: Winter Quest:

- `src/services/auth/routeAccess.ts` defines pure route access decision helpers for public, athlete, coach, developer, and future admin areas.
- `src/components/game/RoleGatePreviewPanel.tsx` presents selected session, target app area, access decision, and explanation copy.
- `src/screens/dev/RoleAccessPreviewScreen.tsx` provides a local-state developer preview for example unauthenticated, athlete, coach, and future admin sessions.
- `app/dev/role-access.tsx` exposes the developer preview route without adding it to main product navigation.
- `src/services/auth/mockAuthSession.ts` includes a safe static future admin preview session.

## Why Role Gate Rules Exist Before Protected Routes

DRIVE handles junior training data, PM5 evidence, coach verification, and future rewards. Role access rules need to be centralised before any route protection is enabled so future work has one place to reason about athlete, coach, and admin boundaries.

This protects the product promise that athletes see only their own training context, coaches review only authorised club or squad evidence, and reward-sensitive workflows stay behind trusted verification gates.

## Why This Step Does Not Enforce Routing

This foundation describes intended decisions only. It does not redirect, guard routes, hide preview routes, change Expo Router behaviour, or switch the app away from preview navigation.

Protected routes require a later explicit step because they affect auth state handling, unauthorised user experience, Firestore and Storage policies, and safeguarding decisions for junior athlete data.

## How Access Is Represented

Public and developer preview areas remain available for now. These decisions exist so reviewers can keep inspecting the current preview shell while protected routing is still absent.

Future athlete access requires a complete athlete session with role, club, squad, and linked athlete claims. Athlete access is described as own-area access only, not permission to view another athlete.

Future coach access requires a complete coach session with role, club, and squad claims. Coach access is described as club or assigned squad scoped only.

Future admin is represented for planning only. It does not grant broad access to athlete or coach areas and does not enable admin routes or admin features.

## Why Missing Claims Must Not Grant Access

Unauthenticated sessions and missing or incomplete DRIVE claims must not grant access to future protected athlete or coach areas. A signed-in Firebase user without valid DRIVE role claims is not enough to become an athlete, coach, or admin in DRIVE.

This conservative default protects junior athlete privacy and avoids accidental access if account provisioning or custom claims are incomplete.

## Why Admin Is Future Only

Admin may be needed later for club, squad, coach, or system management, but those workflows are not part of this step. Admin is intentionally not a bypass because broad access would affect junior data, coach authority, and safeguarding review.

Future admin functionality needs explicit product approval, rules, and UI before it can become real.

## Why Preview Routes Remain Available

The current athlete, coach, auth, and developer routes are preview surfaces. They remain available so the team can inspect product flow, access copy, safeguarding language, and training-quality UI before real enforcement exists.

No route is hidden when unauthenticated, and no route is unlocked when authenticated.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Protected routes, route guards, or auth redirects exist.
- Public signup or account creation is approved.
- Firestore profile lookup or Firebase repositories exist.
- The repository provider should switch away from mocks.
- Firebase Storage upload or real PM5 upload exists.
- Real submit, approve, or reject actions exist.
- Reward calculation or trusted reward writes exist.
- Athlete progress, squad progress, River Map progress, or Boathouse progress can be written.
- Admin is a broad bypass role.
- Preview routes should be hidden before a later explicit protected-routing step.

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected routes, redirects, Firestore reads, Firestore writes, Firestore repositories, repository provider switching, Firebase Storage upload, real PM5 upload, real submit actions, real approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
