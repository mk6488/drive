# Repository Provider Foundation

## What Was Added

Step 16 adds a small repository provider foundation for DRIVE: Winter Quest:

- `src/services/repositories/repositoryProvider.ts` defines the screen-facing `RepositoryProvider` type.
- `mockRepositoryProvider` groups the existing mock read repositories behind that provider shape.
- `getRepositoryProvider()` returns the mock provider for now.
- Trusted reward and progress write repositories remain exported separately as trusted boundaries only.
- Current athlete and coach screens now import repositories through the provider instead of importing mock repositories directly.

## Why Screens Should Not Import Mock Repositories Directly

Screens should depend on stable repository contracts, not on a specific mock implementation. This keeps screens focused on displaying state and collecting local preview input while data access remains behind repository boundaries.

Direct mock imports make future Firebase work harder because each screen would need to be changed when real repositories arrive. The provider keeps that future replacement focused on infrastructure wiring rather than product screen rewrites.

## Why The Provider Is Mock Backed Only For Now

The provider deliberately returns mock repositories only. This step exists to control architecture before Firebase exists, not to start real persistence.

There is no environment switching, Firebase selection, authentication dependency, Firebase config, storage setup, or live data path in this foundation.

## Why Firebase Is Deliberately Not Added Yet

Firebase work needs explicit approval because it affects authentication, permissions, private PM5 evidence handling, data mapping, security rules, and trusted reward or progress writes.

Adding Firebase during this step would blur the boundary between a provider foundation and real infrastructure. DRIVE should keep repository contracts stable first, then implement Firebase repositories in a later approved step.

## How This Prepares Future Firebase Repositories

Future Firebase repositories can implement the existing repository contracts:

- `AthleteRepository`
- `SquadRepository`
- `QuestRepository`
- `SubmissionRepository`
- `RewardReadRepository`
- `ProgressReadRepository`

When that work is approved, provider selection can be added explicitly so product screens keep using the same provider shape.

## Why Trusted Writes Remain Separated

Trusted reward and progress writes are not part of the screen-facing provider. They stay separate because athlete-facing UI screens must not write XP, badges, attributes, reward results, squad mission progress, River Map progress, or Boathouse progress.

Those writes belong to future trusted verification and reward workflows after coach verification. Keeping them separate protects the DRIVE rule that progress is earned through coach verified execution quality, not client UI actions.

## What Future Agents Must Not Infer

Future agents must not infer from this foundation that:

- Firebase has been added.
- Authentication or role enforcement exists.
- Firebase config, environment variables, or provider switching are approved.
- Real PM5 upload or Firebase Storage exists.
- Real submit, approve, or reject actions exist.
- Reward calculation is implemented.
- Reward results, athlete progress, squad progress, River Map progress, or Boathouse progress can be written from UI.
- Mock data should be mutated to simulate real workflows.

## Deliberately Out Of Scope

This step intentionally excludes:

- Firebase implementation.
- Authentication.
- Firebase config and environment variables.
- Real PM5 upload.
- Real submit actions.
- Real approve or reject actions.
- Reward calculation.
- Athlete progress writes.
- Squad progress writes.
- Reward result writes.
- Leaderboards and public rankings.
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features.
