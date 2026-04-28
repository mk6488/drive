# Submission And Verification Command Boundaries

## What Was Added

Step 17 adds a command boundary foundation for future submission and coach verification workflows:

- `src/services/submissions/submissionCommands.ts`
- `src/services/submissions/verificationBoundary.ts`

These files define TypeScript input types, simple validation helpers, and pure status gate helpers only. They do not perform database writes, repository calls, uploads, submit actions, approve actions, reject actions, reward calculation, or progress updates.

## Why Command Boundaries Exist Before Real Workflows

DRIVE needs clear workflow edges before persistence or infrastructure is added. Submission and verification commands will eventually be sensitive product actions because they decide when athlete evidence enters coach review and when coach judgement can make a submission eligible for rewards.

Defining command inputs now keeps those future workflows explicit and testable without pretending that real upload, submit, approve, or reject behaviour exists.

## Why Athlete UI Must Not Write Progress Or Rewards

Athlete-facing UI must never grant XP, badges, attributes, squad progress, River Map progress, Boathouse progress, or reward results directly.

DRIVE rewards coach verified execution quality, not raw completion or client-side button presses. Allowing an athlete screen to write progress would bypass the verification gate and break the product promise that rewards are earned through honest evidence, useful reflection, and coach oversight.

## Why Coach Verification Is The Gate Before Rewards

Only coach verified submissions can become eligible for future reward processing. Draft submissions have not been sent for review. Submitted submissions are waiting for judgement. Rejected submissions must not unlock rewards.

The verification boundary therefore keeps two rules explicit:

- only `submitted` submissions can be reviewed by a coach
- only `verified` submissions can become eligible for future trusted reward processing

## Why This Step Does Not Create Real Actions

This step intentionally does not create real submit, upload, approve, or reject actions. The command input types describe future use cases, but they are not executable workflows.

No command function calls repositories, mutates mock data, writes submissions, writes rewards, writes progress, or changes lifecycle state. Those behaviours require later explicit approval and trusted workflow design.

## Why Firebase Is Still Out Of Scope

Firebase remains deliberately out of scope because this step is about product and service boundaries, not infrastructure.

Adding Firebase now would imply storage paths, authentication, permissions, security rules, and live repository behaviour before the command workflow has been approved. Future Firebase work must preserve these command and verification boundaries instead of letting screens write directly to Firestore or Storage.

## What Future Agents Must Not Infer

Future agents must not infer that this foundation added:

- Firebase
- authentication
- Firebase config or environment variables
- real PM5 upload
- real submission draft saving
- real submit actions
- real coach approve or reject actions
- mock data mutation
- reward calculation
- reward result writes
- athlete progress writes
- squad progress writes
- River Map or Boathouse progress writes
- command writes exposed through the screen-facing repository provider

The repository provider must remain read focused unless a later approved workflow explicitly changes that boundary.

## Deliberately Out Of Scope

This step intentionally excludes:

- Firebase implementation
- authentication and role enforcement
- Firebase config and environment variables
- real PM5 photo upload or storage
- real submit, approve, or reject workflows
- reward calculation
- reward result writes
- athlete progress writes
- squad mission progress writes
- River Map progress writes
- Boathouse progress writes
- leaderboards or public rankings
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features
