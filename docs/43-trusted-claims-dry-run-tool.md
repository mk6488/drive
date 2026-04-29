# Trusted Claims Dry Run Tool

## What Was Added

Step 36 adds a local trusted claims dry run tool inside the `functions/` workspace:

- `functions/src/dryRunRoleClaimAssignment.ts` reads a local JSON request, validates it with the existing pure role claim validation helpers, and prints a dry run report.
- `functions/samples/coach-claim.dry-run.json`, `functions/samples/athlete-claim.dry-run.json`, and `functions/samples/incomplete-claim.dry-run.json` provide fake local examples.
- `functions/package.json` includes scripts for coach, athlete, and incomplete dry runs.
- `functions/README.md` documents the local-only trusted planning boundary.

No deployment happened, no function endpoint was created, and no custom claims were set.

## Why Dry Run Validation Exists

DRIVE role claims will eventually affect access to junior athlete training data, private PM5 evidence, coach verification surfaces, and reward-sensitive progress.

Before any real Firebase custom claims are written, proposed role assignments need a safe local way to check whether required fields are present, whether fields are malformed, and whether the resulting claim shape stays narrow enough for a future trusted workflow.

This dry run exists to catch missing fields, unsafe broad access assumptions, and incomplete junior data boundaries before live claim setting is ever introduced.

## How To Run The Fake Samples

From the `functions/` folder:

```bash
npm run dryrun:coach
npm run dryrun:athlete
npm run dryrun:incomplete
```

Each script builds the functions workspace and runs Node against the compiled dry run tool. The incomplete sample is expected to report blocked validation while still proving that the tool can display missing and invalid fields without setting claims.

## Why This Does Not Set Custom Claims

The dry run imports only local validation code. It does not import `firebase-admin`, initialise Firebase Admin, call `setCustomUserClaims`, create users, read Firestore, or write Firestore.

The output is a planning report only. It says whether the request is shaped for a future trusted workflow, shows the target user id, requested role, proposed claims, missing fields, invalid fields, safety messages, and confirms that no Firebase custom claims were set.

## Why Firebase Admin Claim Setting Is Still Not Used

Firebase Admin claim setting is a privileged operational action. It needs an approved trusted workflow, audit trail, requester and approver boundaries, deployment decisions, service account handling, and safeguarding review.

This step deliberately avoids that operational behaviour. The functions workspace remains planning-only and local.

## Why No Service Account Key Is Needed Yet

The dry run reads local JSON files and runs pure validation. It does not contact Firebase, so it does not need a service account key.

Service account files must not be created, requested, stored, or committed for this step.

## Why Samples Must Use Fake Data Only

Sample files are committed as developer examples, so they must never contain real junior names, real Firebase user ids, real club data, real Firebase config, service account data, parent details, or sensitive personal data.

The included samples use placeholder ids such as `example-firebase-uid-athlete`, `example-club`, `example-j15-squad`, and `example-athlete`.

## What Future Agents Must Not Infer

Future agents must not infer from this dry run tool that:

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

This step intentionally excludes deployment, Firebase Admin claim writes, service account setup, live role assignment, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, Firestore reads, Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
