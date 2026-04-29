# Preview Route Boundary Wrapping

## What Was Added

Step 26 wraps the existing athlete and coach preview routes with `ProtectedRouteBoundary` in preview mode only:

- `/athlete`
- `/athlete/submission`
- `/athlete/progress`
- `/athlete/boathouse`
- `/coach`
- `/coach/verification`
- `/coach/quest-builder`

Each athlete route uses `area="athlete"` and each coach route uses `area="coach"`. All wrappers pass `previewModeEnabled={true}` so the current preview screens continue to render.

The protected route status panel also has slightly more compact preview-only wording so it can sit above real preview screens without feeling like route enforcement has been enabled.

## Why Athlete And Coach Routes Are Wrapped Now

DRIVE will eventually need role-aware access around athlete training areas and coach review areas because the product handles junior athlete training evidence, coach verification, and future reward-sensitive progress.

Wrapping the current preview routes makes those future expectations visible on the real product surfaces now. It helps reviewers and future agents see that athlete and coach areas are intended to become role-aware later, while preserving the open preview navigation needed for development and product review.

## Why Preview Mode Keeps Screens Visible

`ProtectedRouteBoundary` renders its status panel and then renders its children. In this step, every wrapped product route passes `previewModeEnabled={true}`.

That means the boundary reports the current future access decision, but it does not block rendering. An unauthenticated session may be described as not authorised for a future athlete or coach area, but the athlete or coach screen still remains visible.

## Why This Is Not Real Route Protection

This step does not enable protected routes. It does not redirect, replace navigation state, hide children, block routes, require a real login, or unlock routes based on auth state.

The route access decision remains preview information only. `routeAccess.ts` still returns decisions with `isPreviewOnly: true` and `isEnforced: false`.

## Why Public And Dev Routes Remain Unwrapped

Public and developer preview routes remain open because they are not athlete or coach product areas:

- `/`
- `/auth/login`
- `/dev/submission-lifecycle`
- `/dev/role-access`
- `/dev/protected-route-boundary`

Leaving these routes unwrapped preserves the current preview shell, keeps developer inspection tools available, and avoids implying that sign in or developer routes are protected product workflows.

## Why Firestore Profile Lookup Is Still Out Of Scope

Firestore profile lookup would connect route access to live user data and would require repositories, read rules, loading states, missing-profile handling, and claim/profile reconciliation.

This step uses only the existing `AuthProvider` session and pure route access helpers. It does not read Firestore, write Firestore, add Firestore repositories, switch the repository provider away from mocks, or fetch user profiles from live data.

## What Future Agents Must Not Infer

Future agents must not infer from this wrapping that:

- public signup or account creation is approved
- real protected routes are enabled
- auth redirects are enabled
- preview routes should be hidden
- athlete or coach screens should be blocked before a later explicit enforcement step
- Firestore profile lookup exists
- Firebase repositories exist
- the repository provider should switch away from mocks
- Firebase Storage upload or real PM5 upload exists
- real submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written
- leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features are approved

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, route enforcement, auth redirects, hiding or blocking preview routes, Firestore reads, Firestore writes, Firestore repositories, repository provider switching, Firebase Storage upload, real PM5 upload, real submit actions, real approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
