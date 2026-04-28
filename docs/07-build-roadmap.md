# Build Roadmap

## Step 1: Guardrails

Create product documentation, architecture notes, and Cursor rules.

No app code, Expo setup, package installation, screens, or Firebase code should be added in this step.

## Step 2: Project Setup

When explicitly requested later:

- Initialise Expo React Native
- Add TypeScript setup
- Add linting and typechecking
- Establish folder structure
- Add placeholder environment guidance without secrets

Do not skip straight to features before the project skeleton is approved.

## Step 3: Domain Types And Architecture Skeleton

Add the basic domain types and folder boundaries:

- Screens
- Components
- Services
- Repositories
- Reward engine
- Shared types

Keep screens UI only from the beginning.

## Step 4: Quest And Submission MVP

Build the core athlete loop:

- View Today's Quest
- Upload PM5 photo
- Add reflection
- Submit for verification
- See pending, verified, or rejected state

No automatic PM5 reading in this phase.

## Step 5: Coach Verification

Build the coach verification workflow:

- Review pending submissions
- View PM5 evidence and reflection
- Verify or reject
- Add practical rejection reason

Rewards still must not unlock before verification.

## Step 6: Reward Engine

Build deterministic reward calculation for verified submissions:

- XP
- Badge unlocks
- Engine, Discipline, Rhythm, and Grit changes
- Reward explanations

Tests should focus heavily on verification-gated reward behaviour.

## Step 7: Squad And Progress Systems

Add squad-facing progress:

- Squad missions
- River Map progress
- Boathouse progress

Progress must be driven by verified training effort, not raw upload count.

## Step 8: Firebase Hardening

Strengthen data access:

- Repository mapping
- Firebase security rules
- Permission checks
- Storage path consistency
- Audit-friendly reward records

## Future Possibilities

These are not MVP tasks:

- Coach dashboard expansion
- OCR
- Concept2 Logbook API
- Live PM5 Bluetooth
- Unity or Godot game layer

Treat these as future product decisions requiring explicit approval.

## Agent Warning

Follow the roadmap in order unless the user explicitly changes priority. Do not turn a planning step into an implementation step.
