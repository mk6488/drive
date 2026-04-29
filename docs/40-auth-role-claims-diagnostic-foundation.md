# Auth Role Claims Diagnostic Foundation

## What Was Added

Step 33 adds a Firebase Auth custom-claims diagnostic foundation for DRIVE: Winter Quest:

- `src/services/auth/authClaims.ts` defines the expected DRIVE custom claim shape and pure validation helpers.
- `src/services/auth/authService.ts` now validates Firebase Auth token claims before creating a DRIVE authenticated session.
- `src/components/game/AuthClaimsDiagnosticPanel.tsx` presents signed-in and claim-readiness status without importing Firebase.
- `src/screens/dev/AuthClaimsDiagnosticPreviewScreen.tsx` and `app/dev/auth-claims.tsx` expose a developer preview route.
- `src/screens/auth/LoginScreen.tsx` shows the diagnostic when a signed-in account is not ready for DRIVE access yet.

## Why Custom Claims Are Needed

DRIVE handles junior athlete training data, coach verification, PM5 evidence, and future reward-sensitive progress. A Firebase Auth user id alone is not enough to decide whether someone is an athlete or coach in DRIVE.

Future role-sensitive access needs trusted role claims such as `role`, `clubId`, `squadIds`, `linkedAthleteId`, and `displayName` so the app can distinguish athlete and coach context before any protected route or live data access is enabled.

## Why Missing Claims Must Not Grant Access

Missing or incomplete DRIVE claims now produce a safe incomplete session state rather than an authenticated athlete or coach session.

This protects junior data and coach authority. A Firebase test user may be signed in, but without complete trusted DRIVE claims the account must not gain athlete access, coach access, admin bypass behaviour, Firestore access, PM5 upload, or reward-sensitive actions.

## Why The Current Test User Shows Account Not Ready

The current observed behaviour is expected: a Firebase test user can sign in, but the app says the account is not ready for DRIVE access yet because the required DRIVE custom claims are missing.

That message means Firebase Auth accepted the credentials, but DRIVE has not received a complete trusted role boundary for that user.

## Expected Future Claim Fields

The diagnostic foundation expects these future custom claim fields:

- `role`
- `clubId`
- `squadIds`
- `linkedAthleteId`
- `displayName`

Allowed claim roles are:

- `athlete`
- `coach`
- `adminFuture`

Athlete claims require `role`, `clubId`, `linkedAthleteId`, and `displayName`. Coach claims require `role`, `clubId`, and `displayName`, and may include `squadIds` to describe assigned squad context.

`adminFuture` is recognised for planning only. It must not grant broad access, become a shortcut into athlete or coach areas, or create admin tooling.

## Why This App Does Not Assign Custom Claims

Firebase custom claims are a trusted account-provisioning concern. They must not be assigned by this client app because client-side role assignment would let users grant themselves athlete, coach, or future admin privileges.

This step does not add public signup, account creation, claim editing, role assignment UI, or admin tools.

## Why Firebase Admin SDK And Cloud Functions Are Not Added Yet

Firebase Admin SDK and Cloud Functions would introduce trusted server-side behaviour. That work needs a later explicit step because it affects account provisioning, role assignment policy, auditability, safeguarding, deployment, and operational security.

This diagnostic foundation only makes the missing-claims state visible. It does not create the trusted process that will eventually assign claims.

## Why Protected Routes Are Still Not Enabled

Protected routes remain out of scope. This step reports claim readiness only; it does not redirect users, hide preview routes, block route children, or enforce route access.

Future protected routing still needs explicit product and safeguarding approval around unauthorised states, Firestore and Storage rules, live repository use, and junior data access.

## What Future Agents Must Not Infer

Future agents must not infer from this diagnostic that:

- public signup or account creation is approved
- the client app can assign roles or set custom claims
- Firebase Admin SDK or Cloud Functions have been added
- protected routes, redirects, or hidden preview routes are enabled
- Firestore reads or writes are allowed
- Firebase Storage upload, image picking, or real PM5 upload exists
- real submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written
- `adminFuture` is a broad bypass role
- missing claims may fall back to a default athlete or coach role

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, admin role assignment tools, custom claim writing, Firebase Admin SDK, Cloud Functions, protected route enforcement, redirects, hidden preview routes, repository provider switching, Firestore reads, Firestore writes, Firebase Storage upload, image picking, real PM5 upload, real submit actions, real approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
