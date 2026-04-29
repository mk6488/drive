# Trusted Claims Live Apply Script Foundation

## What Was Added

Step 40 adds a guarded live claim apply script foundation inside the `functions/` workspace:

- `functions/src/applyRoleClaimAssignment.ts` reads a local JSON request, validates it, creates an audit draft, evaluates the safety gate, prints a live apply report, and refuses by default.
- `functions/src/firebaseAdmin.ts` contains explicit Firebase Admin initialisation helpers that are only called by trusted server-side code after the live script gates pass.
- `functions/package.json` includes `apply:claims`, which requires the operator to pass a JSON file path explicitly.

This step did not run the script and did not set Firebase custom claims.

## Why The Script Lives Only In Functions

Role claims decide future access to junior athlete training context, coach verification surfaces, private PM5 evidence, and reward-sensitive progress.

The client app must never assign roles, promote users, or call Firebase Admin APIs. Keeping the script in `functions/` preserves a trusted server-side boundary and avoids creating client-side role assignment tools.

## Why Live Apply Is Blocked By Default

The script must be difficult to trigger accidentally. It refuses to apply unless every required runtime safety condition passes:

- `DRIVE_CLAIMS_LIVE_APPLY` equals `true`.
- `confirmationPhrase` equals `APPLY_DRIVE_ROLE_CLAIMS`.
- `requestedApplyMode` is `live`.
- Claim validation passes.
- An audit draft is created.
- The claim apply safety gate allows apply.
- The role is `athlete` or `coach` only.
- `targetUserId`, `trustedActorId`, `auditReason`, and `clubId` are present.
- `linkedAthleteId` is present for athlete role.

If any check fails, the script prints block reasons and exits without setting claims.

## Why `adminFuture` Remains Blocked

`adminFuture` is still a planning label only. It must not become broad system access, athlete access, coach access, or a shortcut around missing claims.

Future admin behaviour requires separate product, security, audit, and safeguarding approval before any live claim can be assigned.

## Why Samples Must Remain Fake

Committed samples are developer examples only. They must never contain real Firebase user ids, real junior names, real club data, real Firebase config, service account data, parent details, or sensitive personal information.

The current sample target user ids remain obviously fake, such as `example-firebase-uid-athlete` and `example-firebase-uid-coach`.

## Why Service Account Files Must Not Be Committed

Firebase Admin credentials are privileged. If local credentials are ever used for an approved live apply, they must come from local standard Admin SDK credential setup and remain outside source control.

Do not create, request, store, or commit service account files. The repository ignores common service account and local environment file patterns, and those files must stay local.

## Why This Step Does Not Run The Script

This step creates the foundation only. Running live apply would be an operational action with real access consequences for junior athlete and coach data boundaries.

No `apply:claims` command was run, `DRIVE_CLAIMS_LIVE_APPLY` was not set, and no Firebase custom claims were set during this step.

## Why The Client App Still Cannot Assign Roles

The client app has no Firebase Admin access, no role assignment UI, no public signup, no protected-route enforcement, and no custom-claim writing capability.

Client-side role assignment would let users promote themselves or broaden access, so it remains deliberately impossible.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- live claim setting should be run casually
- service account files should be committed
- samples may contain real user ids or junior names
- `adminFuture` can be applied
- the client app may assign roles or set custom claims
- public signup or account creation is approved
- protected routes, redirects, or hidden preview routes are enabled
- the app should switch to Firebase repository mode
- Firestore reads or writes are approved in the app
- PM5 upload, submit, approve, or reject actions exist
- reward calculation or trusted reward writes exist
- athlete progress, squad progress, River Map progress, or Boathouse progress can be written

## Deliberately Out Of Scope

This step intentionally excludes deployment, running a live apply, setting real Firebase custom claims, creating service account files, public signup, account creation, client-side role assignment tools, protected route enforcement, auth redirects, hidden preview routes, repository provider switching, app Firestore reads, app Firestore writes, PM5 upload, submit actions, approve or reject actions, athlete progress writes, squad progress writes, reward result writes, reward calculation, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
