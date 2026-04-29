# Controlled Auth Provider Shell

## What Was Added

Step 23 adds a controlled Auth Provider shell for DRIVE: Winter Quest:

- `src/services/auth/AuthProvider.tsx` owns central preview-safe Firebase Auth session observation.
- `useDriveAuth()` exposes the current DRIVE auth session, loading state, safe auth boundary warning, and sign out action.
- `app/_layout.tsx` wraps the existing Expo Router stack in `AuthProvider`.
- `src/components/game/AuthSessionStatusPanel.tsx` presents loading, unauthenticated, authenticated, and auth warning states.
- The welcome and login previews can now show the current auth session without changing route access.

## Why Central Auth State Exists Before Protected Routes

DRIVE will eventually need one trusted session boundary before athlete and coach areas can become protected. Adding the provider now keeps Firebase Auth observation in the service layer instead of scattering subscription logic across screens.

This prepares the app for later role-aware route work while preserving the current preview shell. The provider only reports session state. It does not decide where users can go.

## Why The Provider Defaults Safely When Firebase Is Missing

Local preview builds may not have Firebase environment values. If Firebase is not configured, the provider catches the subscription failure, keeps the session unauthenticated, stops loading, and exposes a safe warning message.

This prevents the preview app from crashing while making the missing configuration visible. Missing Firebase config must never grant athlete, coach, or admin access.

## Why It Does Not Redirect Or Guard Routes Yet

Protected routes require settled auth claims, route policy decisions, and live data access boundaries. This step deliberately avoids route guards and redirects so it does not imply that role enforcement is complete.

The app remains on preview navigation. Signing in or signing out changes displayed session state only.

## Why Firestore Profile Lookup Is Still Out Of Scope

Firestore profile lookup would connect the app to live user data, require repositories, read rules, profile mapping, and error states. That belongs in a future approved repository step.

This provider only observes Firebase Auth and maps existing custom claims through the auth service. It does not read Firestore, write Firestore, add Firestore repositories, or switch the repository provider away from mocks.

## Why Preview Routes Remain Available

The current athlete, coach, auth, and developer screens are preview routes. They remain available so the team can continue reviewing product flow, safeguarding copy, and training-quality UI while real access enforcement is still absent.

No route is hidden when unauthenticated, and no route is unlocked when authenticated.

## What Future Agents Must Not Infer

Future agents must not infer from this provider that:

- Public signup or account creation is approved.
- Protected routes, route guards, or auth redirects exist.
- Firestore user profile lookup exists.
- Firebase repositories exist.
- The repository provider should switch away from mocks.
- Firebase Storage upload or PM5 evidence upload exists.
- Real submit, approve, or reject actions exist.
- Reward calculation or trusted reward writes exist.
- Athlete progress, squad progress, River Map progress, or Boathouse progress can be written.
- Preview routes should be hidden before a later explicit protected-routing step.

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, password reset, protected routes, redirects, Firestore reads, Firestore writes, Firebase repositories, repository provider switching, Firebase Storage upload, PM5 upload, real submit actions, real approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
