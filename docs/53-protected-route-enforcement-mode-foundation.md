# Protected Route Enforcement Mode Foundation

## What Was Added

Step 46 adds a controlled route protection mode foundation for DRIVE: Winter Quest:

- `src/services/auth/routeProtectionMode.ts` defines the route protection mode helpers.
- `.env.example` documents `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=preview`.
- `ProtectedRouteBoundary` now uses the route protection mode by default while still accepting `previewModeEnabled` as an explicit override.
- `ProtectedRouteStatusPanel` reports the requested mode, active mode, and whether enforcement is active.
- Existing athlete and coach route wrappers now use the default mode behaviour instead of hardcoding preview mode.
- The role access smoke test preview shows the current route protection mode status.

## Why Route Protection Needs An Environment-Controlled Mode

DRIVE handles junior training context, PM5 evidence, coach verification, and future reward-sensitive progress. Turning on protected route blocking changes how athlete and coach areas behave, so it must be deliberate, visible, and easy to keep disabled during normal preview work.

The mode helper centralises that decision in one pure service. It does not import Firebase, read Firestore, write Firestore, redirect users, mutate navigation, or change unwrapped routes.

## Why Preview Remains The Default

Preview mode remains the default because DRIVE is still a reviewable app shell with protected route foundations, not a fully enforced product. Missing `EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE` means preview. Invalid values also fall back to preview.

In preview mode, wrapped route children remain visible even when the access decision says a future protected area would not be authorised. This preserves local development and product review while role claims and access copy continue to be tested.

## How The Environment Variable Works

Use this Expo public environment variable for controlled testing:

```bash
EXPO_PUBLIC_DRIVE_ROUTE_PROTECTION_MODE=preview
```

Allowed values are:

- `preview`
- `enforced`

Only the exact value `enforced` activates enforcement. Any missing, empty, or invalid value falls back to preview.

## Why Enforced Mode Is Not Enabled By Default

Enforced mode can block unauthorised children inside wrapped athlete and coach route boundaries. That behaviour affects junior data access expectations and unauthorised user experience, so it must be selected explicitly.

This step does not turn local development or normal preview routes into enforced routes by default.

## Why Redirects Are Still Out Of Scope

Redirects would introduce navigation policy, destination choices, unauthorised state design, and edge cases around loading or incomplete claims. Those decisions need a later explicit step.

This foundation does not redirect, replace routes, mutate navigation state, or hide public or developer routes.

## Why Public And Dev Routes Remain Open

Only routes already wrapped in `ProtectedRouteBoundary` can be affected by the mode. Public and developer routes remain open for product review, diagnostics, and safe local inspection.

The route protection mode does not make unwrapped routes protected.

## Why Firestore Remains Out Of Scope

Route protection mode is based on the current auth session and existing pure route access helpers. It does not read Firestore, write Firestore, add repositories, switch repository provider mode, upload PM5 evidence, or persist any route decision.

The repository provider remains mock backed by default.

## How The Coach And Athlete Claim Tests Support This Step

The recent diagnostic claim tests confirmed that:

- A test coach role can access coach area decisions while athlete and future admin areas remain blocked.
- A test athlete role can access athlete area decisions while coach and future admin areas remain blocked.

That gives confidence that the central role access rules are behaving as expected before a controlled enforcement mode exists. This step adds the mode switch around those existing decisions without changing the claim assignment process or setting new claims.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- protected route enforcement is enabled by default
- redirects are approved
- public or developer routes should be hidden
- unwrapped routes are protected
- public signup or account creation is approved
- Firebase custom claims should be set
- `apply:claims` should be run
- `DRIVE_CLAIMS_LIVE_APPLY=true` should be set
- the app should switch to Firebase repository mode
- Firestore reads or writes are approved
- Firebase Storage upload or real PM5 upload exists
- submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written
- leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features are approved

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, default protected route enforcement, redirects, hiding public or developer routes, Firestore reads, Firestore writes, repository provider switching, running `apply:claims`, setting new Firebase custom claims, enabling `DRIVE_CLAIMS_LIVE_APPLY`, Firebase Storage upload, real PM5 upload, submit actions, approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
