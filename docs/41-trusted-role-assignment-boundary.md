# Trusted Role Assignment Boundary

## What Was Added

Step 34 adds a trusted role assignment boundary foundation for DRIVE: Winter Quest:

- `src/services/auth/roleAssignmentBoundary.ts` defines future role assignment types and pure validation helpers.
- `src/components/game/RoleAssignmentBoundaryPanel.tsx` explains why role assignment must be trusted.
- `src/screens/dev/RoleAssignmentBoundaryPreviewScreen.tsx` shows safe fake validation examples for planning review only.
- `app/dev/role-assignment-boundary.tsx` exposes the developer preview route.

This step does not assign roles, set custom claims, create accounts, or enable protected access.

## Why Role Assignment Must Be Trusted

DRIVE role claims decide who may eventually enter athlete and coach areas that involve junior training context, private PM5 evidence, coach judgement, and reward-sensitive progress.

A Firebase Auth user id alone is not enough. Athlete and coach access must only be granted when a trusted process has deliberately assigned complete DRIVE role claims.

## Why The Client App Must Not Assign Claims

The client app is controlled by the signed-in user, so it must never be able to promote that user into athlete, coach, or future admin access.

Client-side role assignment would let a user grant themselves coach authority, broaden squad access, or bypass the missing-claims safety state. Coaches must also never be able to promote themselves from the app.

## Why Firebase Admin SDK And Cloud Functions Are Not Added Yet

Firebase custom claims require trusted server-side privileges. A likely future implementation may use Cloud Functions and the Firebase Admin SDK, but that is not added in this step.

That work needs a later explicit implementation step because it affects account provisioning, audit trails, safeguarding policy, operational security, deployment, and incident review.

## Expected Future Athlete Claim Fields

Future athlete role assignment is expected to include:

- `targetUserId`
- `role: athlete`
- `clubId`
- `squadIds`
- `linkedAthleteId`
- `displayName`

Athlete assignment requires `clubId` and `linkedAthleteId`. `squadIds` should be explicit where possible so athlete access can stay scoped.

## Expected Future Coach Claim Fields

Future coach role assignment is expected to include:

- `targetUserId`
- `role: coach`
- `clubId`
- `squadIds`
- `displayName`

Coach assignment requires `clubId`. `squadIds` should be explicit where possible so coach access can stay limited to authorised squad context.

## Why `adminFuture` Is Future Only

`adminFuture` exists only as a planning label for later club, squad, coach, or system administration decisions.

It must not grant broad athlete access, coach access, system access, bypass behaviour, or admin tooling. Future admin features require explicit product, security, audit, and safeguarding approval.

## Why Missing Claims Keep An Account Not Ready

The current safe behaviour is intentional: a Firebase test user may sign in, but without complete DRIVE role claims the app says the account is not ready for DRIVE access.

That protects junior athlete privacy and coach authority. Missing, incomplete, or invalid role claims must not fall back to athlete, coach, or admin access.

## How This Supports Safeguarding

The boundary keeps junior data handling narrow. Role assignment inputs avoid unnecessary junior personal data and do not include parent details, sensitive personal information, messaging data, public profile fields, or performance ranking data.

Trusted and auditable assignment matters because role claims decide access to private training evidence and future coach verification surfaces.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- public signup or account creation is approved
- the client app can assign roles or set custom claims
- Firebase Admin SDK or Cloud Functions have been added
- protected routes, redirects, or hidden preview routes are enabled
- Firestore reads or writes are approved
- Firebase Storage upload, image picking, or real PM5 upload exists
- real submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written
- `adminFuture` is a broad bypass role
- missing claims may fall back to a default athlete or coach role

## Deliberately Out Of Scope

This step intentionally excludes public signup, account creation, client-side role assignment tools, custom claim writing, Firebase Admin SDK, Cloud Functions, server code, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, Firestore reads, Firestore writes, Firebase Storage upload, image picking, real PM5 upload, real submit actions, real approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
