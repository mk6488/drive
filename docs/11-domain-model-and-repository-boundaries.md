# Domain Model And Repository Boundaries

## What This Step Adds

Step 4 adds a clean TypeScript domain model and repository boundaries for DRIVE: Winter Quest without adding Firebase or full workflows.

Added domain types:

- Roles (`athlete`, `coach`, `admin`) for clear permission framing.
- Athlete and squad records with minimal planning fields.
- Coach-set quest structures with execution-focus language from the brief.
- PM5 evidence submission records with explicit verification state.
- Reward and progress record types that reference verified evidence.

Added repository contracts:

- `AthleteRepository`
- `SquadRepository`
- `QuestRepository`
- `SubmissionRepository`
- `RewardRepository`
- `ProgressRepository`

Added preview-only mock repositories and mock data:

- One fake club, squad, athlete, coach-created quest, submitted unverified PM5 evidence record, and placeholder progress record.

## Why Rewards Are Verification-Gated

DRIVE rewards coach-verified execution quality, not unreviewed completion.  
This step keeps that rule explicit in types and boundaries:

- Submissions can be `draft`, `submitted`, `verified`, or `rejected`.
- Reward results reference `verifiedSubmissionId`.
- Progress and reward writes are described as trusted workflow operations, not athlete self-service writes.

This protects reward integrity and reflects safeguarding and coaching boundaries.

## Why Repositories Exist Before Firebase

Repositories are added now to lock in product language and workflow boundaries before infrastructure details:

- UI reads from stable interfaces.
- Future Firebase mapping can implement these interfaces.
- Business workflows can stay in services instead of screens.
- Reward and progress integrity rules remain explicit while infrastructure evolves.

## What Mock Data Is Allowed For

The mock data is for local previews only:

- Screen rendering and copy validation.
- Interface shape validation while Firebase is absent.
- Early flow framing in development environments.

The mock data is not production logic, not permissions logic, and not a real workflow implementation.

## What Future Agents Must Not Infer

From these mocks and interfaces, future agents must **not** infer:

- Firebase is already wired.
- Authentication and role enforcement are implemented.
- Upload, verification, or reward workflows are complete.
- Athletes can grant themselves rewards or progress.
- Mock records represent live or complete product coverage.

## Deliberately Out Of Scope In This Step

This step intentionally does not include:

- Firebase implementation.
- Authentication.
- PM5 upload implementation.
- Coach verification actions.
- Reward calculation engine logic.
- Live quests, leaderboards, OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, or social features.
