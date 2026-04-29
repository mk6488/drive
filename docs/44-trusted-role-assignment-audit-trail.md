# Trusted Role Assignment Audit Trail

## What Was Added

Step 37 adds a trusted role assignment audit trail foundation for DRIVE: Winter Quest:

- `functions/src/roleAssignmentAudit.ts` defines planning-only audit types for future trusted role assignment.
- The trusted claims dry run now includes an audit-style report section.
- `docs/27-firestore-security-rules-foundation.md` now notes that future audit records may need a trusted server-only collection.

No audit record is written, no Firebase custom claim is set, and no live role assignment workflow exists.

## Why Role Assignment Needs An Audit Trail

DRIVE role claims decide who may eventually access athlete and coach areas involving junior athlete training context, private PM5 evidence, coach judgement, and reward-sensitive progress.

Before any real custom claim is set, DRIVE needs a clear model for recording who authorised a role assignment, why it was authorised, which user was targeted, what claims were planned, and what narrow club or squad scope was granted.

## Why This Matters For Junior Safeguarding

DRIVE is built for junior rowers aged 14 to 18. Role assignment mistakes could expose private training evidence, athlete reflections, coach review context, or future reward-sensitive progress to the wrong person.

An audit trail supports safeguarding by making future access decisions reviewable. It also reinforces that coaches must be limited to authorised club or squad context, athletes must be linked to their own athlete record, and incomplete or unclear role assignment must remain blocked.

## Planned Audit Information

The audit foundation models planning fields such as:

- `auditId`
- `status`
- `targetUserId`
- `trustedActorId`
- `requestedByUserId`
- `approvedByUserId`
- `auditReason`
- `role`
- `clubId`
- `squadIds`
- `linkedAthleteId`
- `displayName`
- `proposedClaims`
- `safetyChecklist`
- `createdAt`
- `reviewedAt`
- `appliedAt`
- `notes`

The statuses are planning labels only: `drafted`, `validated`, `approvedForFutureApply`, `blocked`, and `appliedFutureOnly`.

## Why This Step Does Not Write Audit Records

This step only defines the audit model and pure helper functions. It does not add Firestore writes, create an audit collection, add rules for audit records, or persist dry run output.

Writing audit records later needs explicit approval because it affects trusted server workflow design, Firestore rules, retention expectations, incident review, and safeguarding review.

## Why This Step Does Not Set Custom Claims

Firebase custom claim setting remains deliberately out of scope. The dry run still uses pure local validation and audit helpers only. It does not import Firebase Admin, call `setCustomUserClaims`, create users, read Firestore, or write Firestore.

Future claim setting must happen only through an approved trusted server-side workflow with an audit trail and narrow club or squad scope.

## Why Service Account Files Are Still Not Needed

The audit helper and dry run operate on local sample JSON and pure TypeScript functions. They do not contact Firebase, so no service account key is needed.

Service account files must not be requested, created, stored, or committed for this step.

## Why Deployment Is Still Out Of Scope

The functions workspace remains a local planning workspace. This step does not deploy functions, export a live role assignment endpoint, enable custom claim writes, or introduce operational Firebase behaviour.

Deployment needs a later explicit decision with trusted workflow, audit, approval, and safeguarding boundaries in place.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- audit records may now be written
- a Firestore audit collection exists
- Firestore rules for audit records have been added
- custom claims may now be written
- Firebase Admin claim setting is approved
- a live role assignment function exists
- functions have been deployed
- service account keys should be added
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

This step intentionally excludes deployment, Firebase Admin claim writes, service account setup, live role assignment, audit record persistence, Firestore audit rules, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, Firestore reads, Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
