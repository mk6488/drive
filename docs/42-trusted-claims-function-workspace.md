# Trusted Claims Function Workspace

## What Was Added

Step 35 adds a minimal Firebase Functions TypeScript workspace for future trusted DRIVE role claim assignment:

- `functions/package.json` defines a private functions workspace using Node 22.
- `functions/tsconfig.json` enables strict TypeScript compilation for server-side planning code.
- `functions/src/index.ts` documents that no live role assignment function is exported yet.
- `functions/src/roleClaims.ts` defines future server-side claim assignment planning types.
- `functions/src/roleClaimValidation.ts` defines pure validation helpers for those planning types.
- `firebase.json` now points at the functions workspace.

No function is deployed, no custom claim is set, and no live role assignment endpoint exists.

## Repository Hygiene

The functions workspace should keep only source, package metadata, and TypeScript config in git. `functions/node_modules/` is local dependency install output and must not be committed. `functions/lib/` is generated build output and must not be committed.

Local functions environment and runtime files such as `functions/.env`, `functions/.env.local`, `functions/.env.*.local`, and `functions/.runtimeconfig.json` must also stay out of git. This workspace is still not deployed, and it still does not set custom claims.

## Why A Server Workspace Is Needed

DRIVE role claims decide who may eventually access athlete or coach areas involving junior training context, private PM5 evidence, coach judgement, and reward-sensitive progress.

Those claims cannot be assigned by the client app because the client is controlled by the signed-in user. A future trusted server-side process is needed so role changes can be controlled, reviewed, and limited to the correct club and squad scope.

## Why Custom Claims Must Be Trusted

A Firebase Auth user id alone must not grant DRIVE access. Athlete access requires complete athlete claims, and coach access requires complete coach claims.

Missing, incomplete, or malformed claims must keep the account not ready for DRIVE access. There is no fallback that turns a signed-in account into an athlete, coach, or admin.

## Why No Function Is Deployed Yet

This step creates the workspace foundation only. Deploying functions would introduce operational behaviour, permissions, configuration, and incident-review responsibilities that are not part of this step.

Future deployment requires explicit approval, a settled workflow, and safeguards around who can request or approve role changes.

## Why No Custom Claims Are Set Yet

The workspace deliberately avoids Firebase Admin claim writes. The new types and helpers are planning code only and do not import `firebase-admin`, call Auth APIs, read Firestore, or write Firestore.

Future claim setting must happen only through a trusted, auditable workflow.

## Why This Does Not Create Signup

This foundation does not create public signup, account creation, password reset, onboarding screens, or client-side role assignment tools.

Public signup remains out of scope because DRIVE works with junior athletes and needs controlled access, safeguarding review, and club or coach-managed onboarding decisions before accounts are created.

## Why `adminFuture` Is Future Only

`adminFuture` is represented only as a planning role for later club, squad, coach, or system administration decisions.

It must not become a broad bypass into athlete or coach areas, a shortcut around missing claims, or permission to add admin tooling. Future admin behaviour needs explicit product, security, audit, and safeguarding approval.

## Why Assignment Must Be Auditable

Role claims affect access to junior athlete data and coach verification surfaces. Future role assignment must record who approved the change, why it was needed, which user was changed, and what narrow club or squad scope was granted.

Auditability supports safeguarding, operational review, and the product promise that coach verification and reward-sensitive workflows remain trusted.

## Why The Client Still Cannot Assign Roles

The client app still has no claim-writing capability, no role assignment service, no role assignment UI, and no protected-route enforcement. It can only recognise whether trusted claims are present or missing.

Client-side role assignment would let users promote themselves or broaden access, so it remains deliberately impossible.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- functions have been deployed
- custom claims can be written now
- a live callable role assignment function exists
- Firebase Admin claim setting is approved
- public signup or account creation is approved
- protected routes, redirects, or hidden preview routes are enabled
- the app should switch to Firebase repository mode
- Firestore reads or writes are approved in the app
- PM5 upload, submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written
- `adminFuture` is a broad bypass

## Deliberately Out Of Scope

This step intentionally excludes deployment, Firebase login, Firebase Admin claim writes, live role assignment, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, Firestore reads, Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
