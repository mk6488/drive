# Trusted Claims Live Apply Runbook

## Status

Step 39 creates a runbook foundation for a future trusted live claim apply workflow for DRIVE: Winter Quest.

This is planning only. No live claim apply tool exists yet, no Firebase custom claims are set by this step, no Firebase Admin initialisation happens, and no service account file is needed yet.

The client app must never assign roles. Live claim setting will require a later explicit approval step with a trusted, auditable workflow.

## Why A Runbook Is Needed Before Live Apply

DRIVE role claims will eventually decide who may access junior athlete training context, coach verification surfaces, private PM5 evidence, and reward-sensitive progress.

Before DRIVE ever sets real Firebase custom claims, the process needs human approval, clear evidence that the dry run was reviewed, and safeguards that make live apply difficult to trigger accidentally.

This runbook protects the product promise that access decisions are trusted, narrow, auditable, and aligned with coach verified training quality.

## Current Supported Workflow

The current functions workspace supports dry run review only:

```bash
cd functions
npm run dryrun:coach
npm run dryrun:athlete
npm run dryrun:incomplete
```

The dry run validates fake local inputs, prints audit-style planning output, and displays the future apply safety gate. It does not contact Firebase, write audit records, initialise Firebase Admin, or set custom claims.

## Future Live Apply Checklist

A future live claim apply step must not proceed unless every applicable item has been reviewed:

- Target user is a test user or an explicitly approved real user.
- Target user id is confirmed.
- Requested role is `athlete` or `coach` only.
- `adminFuture` remains blocked.
- `clubId` is explicit.
- `squadIds` are explicit where possible.
- `linkedAthleteId` exists for athlete role.
- `displayName` does not contain unnecessary junior personal data.
- Audit reason is present.
- Trusted actor id is present.
- Dry run has been run and reviewed.
- Safety gate output has been reviewed.
- Confirmation phrase is exactly `APPLY_DRIVE_ROLE_CLAIMS`.
- No service account file is committed.
- No junior private data is placed in sample files.
- Live apply is done only from the trusted functions workspace.
- Client app is not involved in assigning roles.

## Future Implementation Boundaries

A future live claim apply implementation must:

- Live only inside the `functions/` workspace.
- Use Firebase Admin SDK only in a trusted script or deployed trusted function.
- Never run from app screens.
- Never expose role assignment to athletes or normal coaches.
- Never allow coaches to promote themselves.
- Block `adminFuture` until separately approved.
- Keep the process auditable.
- Avoid broad role claims.
- Avoid unnecessary junior personal data.

It must not add public signup, client-side role assignment, protected route enforcement, Firestore app reads, Firestore app writes, PM5 upload, submit actions, approve or reject actions, reward calculation, progress writes, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features unless those are separately approved in later steps.

## Mikey Action Required Later

A future approved live apply step may require Mikey to:

- Confirm the test user email.
- Confirm the Firebase UID.
- Confirm the intended role.
- Confirm the `clubId` and `squadIds`.
- Decide whether to use a local trusted script or deployed trusted function.
- Follow a secure credential setup process if required.

No action is required from Mikey in this step.

## What Future Agents Must Not Infer

Future agents must not infer from this runbook that:

- Live claim setting is approved now.
- A live claim apply script exists.
- Firebase Admin initialisation is approved now.
- `setCustomUserClaims` may be called now.
- Service account files should be requested, created, stored, or committed.
- The client app may assign roles.
- Athletes or normal coaches may request or perform role promotion.
- `adminFuture` can be applied.
- Broad club, squad, or admin access is acceptable.

## Deliberately Out Of Scope

This step intentionally excludes deployment, Firebase Admin initialisation, Firebase Admin claim writes, `setCustomUserClaims`, service account setup, live claim apply scripts, live role assignment, audit record persistence, Firestore audit rules, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, Firestore reads, Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
