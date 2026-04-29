# Protected Route Component Foundation

## What Was Added

Step 25 adds a reusable protected route component foundation for DRIVE: Winter Quest without enabling protected routes:

- `src/components/auth/ProtectedRouteBoundary.tsx` reads the current DRIVE auth session through `useDriveAuth()` and asks `getRouteAccessDecision()` for the selected target area.
- `src/components/auth/ProtectedRouteStatusPanel.tsx` presents session state, target area, route access decision, and preview-only explanation copy.
- `src/screens/dev/ProtectedRouteBoundaryPreviewScreen.tsx` provides a local-state developer preview for athlete, coach, and future admin target areas.
- `app/dev/protected-route-boundary.tsx` exposes the developer preview route without adding it to product navigation.

## Why The Component Exists Before Enforcement

DRIVE handles junior athlete training data, PM5 evidence, coach verification, and future rewards. The app needs a clear UI boundary for future protected route behaviour before any route is actually guarded.

Adding the component now lets the team review role-aware copy, safeguarding language, and route access decisions in one place while the app remains a preview shell.

## Why This Step Does Not Enable Protected Routes

Protected routes would change how athletes, coaches, and unauthorised users move through the app. That needs a later explicit step because it affects auth state handling, unauthorised route experience, Firestore and Storage policies, and safeguarding review.

This step does not redirect, hide screens, mutate navigation, wrap product routes, or switch the app away from preview navigation.

## Why Preview Mode Keeps Children Visible

The boundary defaults `previewModeEnabled` to true so children remain visible. This keeps existing preview behaviour intact and makes it obvious that the component is reporting future route access status only.

Even when a decision says the selected session is not authorised, the sample content stays visible because route protection is not enabled yet.

## Why No Redirects Are Used Yet

Redirects would imply a real protected routing policy and a settled unauthorised user experience. DRIVE does not have that policy yet.

This foundation is deliberately passive: it reports route access status and does not navigate, redirect, replace routes, or block rendering.

## Why Firestore Profile Lookup Is Still Out Of Scope

Firestore profile lookup would connect route access to live user data and would require repositories, read rules, loading states, missing-profile handling, and claim/profile reconciliation.

This step uses only the current auth session and pure route access helpers. It does not read Firestore, write Firestore, add Firestore repositories, or switch the repository provider away from mocks.

## Why Preview Routes Remain Available

Preview routes remain available so product flow, safeguarding copy, coach verification language, and training-quality UI can still be reviewed before real access enforcement exists.

No route is hidden when unauthenticated, and no route is unlocked when authenticated.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- protected routes, route guards, or auth redirects are enabled
- existing athlete or coach routes should be wrapped without explicit approval
- public signup or account creation is approved
- Firestore profile lookup or Firebase repositories exist
- the repository provider should switch away from mocks
- Firebase Storage upload or real PM5 upload exists
- real submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written
- admin is a broad bypass role
- preview routes should be hidden before a later explicit protected-routing step

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected route enforcement, redirects, wrapping existing product routes, Firestore reads, Firestore writes, Firestore repositories, repository provider switching, Firebase Storage upload, real PM5 upload, real submit actions, real approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
