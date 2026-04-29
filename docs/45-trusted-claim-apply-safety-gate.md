# Trusted Claim Apply Safety Gate

## What Was Added

Step 38 adds a trusted claim apply safety gate foundation for DRIVE: Winter Quest:

- `functions/src/claimApplySafetyGate.ts` defines pure safety gate types and helpers for future custom claim apply review.
- The trusted claims dry run report now includes a "Future apply safety gate" section.
- Local sample dry run JSON files include fake confirmation, requested apply mode, and environment fields.

No Firebase custom claims are set, no audit records are written, and no live role assignment workflow exists.

## Why A Safety Gate Exists Before Real Claim Setting

DRIVE role claims will eventually affect access to junior athlete training context, private PM5 evidence, coach verification surfaces, and reward-sensitive progress.

Before any real custom claim can be set, DRIVE needs a strict local safety gate that checks whether a proposed assignment is valid, auditable, narrow in scope, and explicitly confirmed. This protects the product promise that access decisions are trusted and reviewable rather than casual client-side role changes.

## Why The Safety Gate Is Pure And Local Only

The safety gate only evaluates input data and returns display-friendly results. It does not import Firebase Admin, initialise Firebase Admin, call Firebase Auth APIs, read Firestore, write Firestore, deploy functions, or mutate any record.

Keeping the helper pure makes the boundary easy to review before privileged behaviour exists.

## Why The Confirmation Phrase Exists

The required confirmation phrase is:

```text
APPLY_DRIVE_ROLE_CLAIMS
```

The phrase must match exactly so a future apply workflow cannot be triggered by an ambiguous or accidental request. The phrase is only a safety signal in this step. It does not unlock real claim setting, because real apply remains deliberately unimplemented.

## Why `adminFuture` Remains Blocked For Apply

`adminFuture` is still a planning role only. It must not become a broad bypass into athlete, coach, system, or admin access.

The safety gate blocks `adminFuture` for apply until a later explicit product, security, audit, and safeguarding decision defines what admin behaviour should mean.

## Why Firebase Admin Is Not Initialised

Firebase Admin initialisation would introduce privileged server behaviour and operational risk. This step does not need privileged credentials because it only evaluates local dry run input.

No Firebase Admin app is initialised, no Auth admin method is called, and no service account file is needed.

## Why No Custom Claims Are Set

This foundation deliberately avoids custom claim writes. The dry run report may say whether validation passed and whether future apply would be blocked, but it never calls `setCustomUserClaims` and never changes a Firebase user.

Real claim setting requires a later approved trusted workflow with audit persistence, operational review, and deployment decisions.

## Why No Audit Records Are Written

The existing audit helper creates a planning draft only. This step uses that draft as input to the safety gate, but it does not persist it.

Writing audit records would require an approved trusted server workflow, Firestore rules or server-only storage design, retention decisions, and safeguarding review.

## Why No Service Account File Is Needed Yet

The dry run reads fake local JSON and runs pure TypeScript helpers. It does not contact Firebase, so a service account key would be unnecessary and unsafe to introduce.

Future agents must not request, create, store, or commit service account files for this foundation.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- custom claims may now be written
- Firebase Admin claim setting is approved
- `setCustomUserClaims` may be called
- a live role assignment function exists
- functions have been deployed
- audit records may now be written
- service account files should be added
- public signup or account creation is approved
- client-side role assignment tools are allowed
- protected routes, redirects, or hidden preview routes are enabled
- the app should switch to Firebase repository mode
- Firestore reads or writes are approved in the app
- PM5 upload, submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written
- `adminFuture` is a broad bypass

## Deliberately Out Of Scope

This step intentionally excludes deployment, Firebase Admin initialisation, Firebase Admin claim writes, service account setup, live role assignment, audit record persistence, Firestore audit rules, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, Firestore reads, Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
