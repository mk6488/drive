# Firebase Auth Service Foundation

## What Was Added

Step 22 adds a controlled Firebase Auth foundation for DRIVE: Winter Quest:

- `src/services/firebase/firebaseAuth.ts` lazily initialises Firebase Auth through the existing Firebase app boundary.
- `src/services/auth/authService.ts` defines the future screen-facing auth service functions.
- `src/services/auth/authErrors.ts` maps common Firebase Auth errors to safe user-facing messages.
- `src/screens/auth/LoginScreen.tsx` adds a sign in shell that calls the auth service only after the user presses sign in.
- `app/auth/login.tsx` exposes the sign in foundation route.
- `src/screens/auth/WelcomeScreen.tsx` links to the sign in foundation while keeping preview routes available.

This step does not add public signup, account creation, protected routes, Firestore user lookup, Firebase repositories, Storage upload, or real role-based navigation.

## Why Firebase Auth Is Isolated In A Service Layer

Firebase Auth is infrastructure. DRIVE screens should collect input and display state, while services own Firebase calls and map provider-specific data into DRIVE auth types.

Keeping Auth inside `src/services/auth/` and `src/services/firebase/` protects future changes. If DRIVE later adjusts claim shape, persistence, emulator setup, or server-side account provisioning, product screens should not need direct Firebase SDK changes.

## Why Screens Must Not Import Firebase Auth Directly

Screens are UI only. Direct Firebase imports in screens would mix product copy, form state, provider errors, token claims, and future role decisions in one place.

For DRIVE, that is especially risky because role boundaries affect junior athlete privacy, coach verification, PM5 evidence access, and reward integrity. Screens must call the DRIVE auth service instead of importing `firebase/auth`.

## Why Public Signup Is Not Added

Public signup would create junior athlete account and safeguarding questions that this foundation does not solve. DRIVE needs controlled access for athletes and coaches, most likely through club or coach-managed onboarding in a later approved step.

This step only supports signing in with an existing Firebase Auth account.

## Why Protected Routes Are Not Added Yet

Protected routes would imply real enforcement across athlete and coach areas. That requires settled auth claims, Firestore and Storage access policies, and product decisions about how unauthorised users are handled.

The app remains on preview navigation. The sign in screen shows a signed-in preview state only and does not redirect users into athlete or coach areas.

## Why Firestore User Profile Lookup Is Not Added Yet

Firestore profile lookup would connect the app to live user data and require repositories, read rules, loading states, and error handling. This step deliberately avoids app Firestore reads and writes.

For now, role context is expected to come from Firebase custom claims only. Future profile reads need a separate approved repository step.

## Planned Custom Claims

Future Firebase Auth custom claims are expected to use only these role boundary fields:

- `role`
- `clubId`
- `squadIds`
- `linkedAthleteId`
- `displayName`

Athlete sessions require an athlete role, club scope, squad scope, linked athlete id, and display name. Coach sessions require a coach role, club scope, squad scope, and display name. Admin remains future planning only.

## Why Missing Claims Must Not Grant Access

Missing or malformed claims return an unauthenticated session shape rather than granting athlete or coach access by default. This avoids accidental access if a Firebase user exists but has not been prepared for DRIVE.

There is no fallback that turns a signed-in Firebase account into a DRIVE athlete, coach, or admin.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Public signup or account creation is approved.
- Password reset is approved.
- Protected routes or role-based redirects exist.
- Firestore user profile lookup exists.
- Firebase repositories exist.
- The repository provider should switch away from mocks.
- Firebase Storage upload or PM5 evidence upload exists.
- Real submit, approve, or reject actions exist.
- Reward calculation or reward writes exist.
- Athlete progress, squad progress, River Map progress, or Boathouse progress can be written.
- Screens may import Firebase SDKs directly.

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, protected routes, route redirects, Firestore reads, Firestore writes, Firebase repositories, provider switching, Firebase Storage upload, PM5 upload, real submit actions, real approve or reject actions, reward calculation, reward result writes, athlete progress writes, squad progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
