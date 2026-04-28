# Technical Architecture

## Future Direction

The preferred future stack is:

- Expo React Native
- TypeScript
- Firebase Auth
- Firestore
- Firebase Storage
- Repository pattern

This document describes the intended architecture, but step 1 must not initialise Expo, install packages, or add app code.

## Architecture Principles

- Screens are UI only.
- Business logic lives in services.
- Firebase access lives in repositories or services.
- Reward logic lives in a dedicated reward engine.
- Shared types should make the quest, submission, verification, and reward flow explicit.
- Keep MVP code boring, testable, and easy for coaches and athletes to understand.

## Suggested Layers

### Screens

Screens should display state, collect input, and call hooks or services. They should not calculate rewards, write directly to Firestore, or contain permission logic.

### Components

Components should be reusable UI pieces with minimal business knowledge.

### Services

Services coordinate use cases, such as submitting evidence, verifying a submission, or updating progress after rewards are calculated.

### Repositories

Repositories isolate Firebase reads and writes. Screens must not import Firebase SDKs directly.

### Reward Engine

The reward engine calculates XP, badge unlocks, attribute changes, squad mission contribution, River Map movement, and Boathouse progress from verified training inputs.

### Types

Types should describe core concepts clearly:

- User
- Squad
- Quest
- Submission
- Verification
- RewardResult
- AthleteProgress
- SquadMission
- RiverMapProgress
- BoathouseProgress

## Firebase Boundaries

Firebase should be treated as infrastructure, not scattered throughout the app.

Use repositories for collection access and services for workflow logic. This keeps screens clean and makes reward behaviour easier to test.

## Testing Direction

Once an app exists, prioritise tests around:

- Reward engine behaviour
- Verification-gated rewards
- Repository mapping
- Service workflows
- Permission-sensitive coach and athlete actions

## Non-MVP Technology

Do not add these in the MVP:

- OCR
- Concept2 Logbook API
- Live PM5 Bluetooth
- Unity
- Godot

Mentioning them in planning is acceptable only as future context. Implementing them requires explicit approval.

## Agent Warning

Do not start building the app from this document alone. Future implementation work must first read all docs in `docs/` and follow the Cursor rules in `.cursor/rules/`.
