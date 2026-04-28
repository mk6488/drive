# Reward System

## Principle

DRIVE rewards execution quality after coach verification.

Rewards must not be granted from raw completion, unverified uploads, estimated metres, or fastest split alone.

## Reward Inputs

The reward engine should eventually use structured inputs such as:

- Quest target
- Session type
- Submitted PM5 evidence
- Athlete reflection
- Coach verification result
- Coach notes or reason for rejection
- Previous verified sessions
- Squad mission state

The MVP does not use OCR, Concept2 API data, or live PM5 Bluetooth data. PM5 evidence is manually reviewed by the coach.

## Verification Gate

The verification gate is mandatory:

1. Athlete submits upload and reflection.
2. Submission is submitted and waiting for coach review.
3. Coach verifies or rejects it.
4. Reward engine runs only for verified submissions.
5. Progress updates are saved after reward calculation.

Rejected submissions must not award XP, badges, attributes, squad progress, River Map progress, or Boathouse progress.

## XP

XP should represent verified training value, not raw speed.

Good XP reasons include:

- Completing the quest as prescribed
- Staying near the target pace
- Staying near the target rate
- Consistent pacing across intervals or time blocks
- Useful reflection
- Improvement against previous verified attempts
- Contributing to a squad mission

## Attributes

DRIVE uses four athlete attributes:

- Engine: aerobic and power development shown through appropriate effort
- Discipline: pacing discipline, session completion, and honest training habits
- Rhythm: rate control, consistency, and repeatable movement
- Grit: perseverance, reflection, and commitment across the block

Attribute changes must be explainable. Do not increase attributes randomly or only because metres were completed.

## Badges

Badges should be tied to meaningful behaviour, verified milestones, or improvement. First milestone badges are allowed when they reinforce a useful habit, such as uploading evidence properly, completing a first verified session, or writing a useful coach-facing reflection.

Example badge groups:

### Bronze

- First Screen Uploaded
- First Verified Session
- 3 Sessions Completed
- First Negative Split
- First Rate Cap Completed
- First Coach Reflection

### Silver

- 10 Verified Sessions
- 4 Week Streak
- Rate 20 Mastery
- Split Discipline
- Recovery Hero
- Honest Upload

### Gold

- 50 Verified Sessions
- 100k Club
- 250k Club
- 500k Club
- Perfect Week
- Captain's Standard
- Winter Warrior
- Pacing Surgeon
- Grit Badge

### Secret Or Fun

- Comeback Session
- Silent Grinder
- The Metronome
- No Drama November
- Coach's Choice
- Big Dog Energy
- Tiny Rate Monster
- Split Goblin Slayer

These examples are product direction, not a requirement for MVP day one. Do not add every badge at once unless the user explicitly asks for that implementation scope.

Do not add badges just to fill a collection screen. Each badge should have a clear training reason and a clear unlock condition.

## Reward Engine

Reward logic must live in a dedicated reward engine, not in screens.

The reward engine should be deterministic where possible: given the same verified submission and quest data, it should return the same reward result.

## Auditability

Rewards should be explainable to athletes and coaches. Store enough information to answer:

- Why did this athlete receive this XP?
- Which attributes changed and why?
- Which badge unlocked?
- Which verified submission caused the progress update?

## Anti-Gaming Notes

Avoid incentives that reward dishonest uploads, chasing unsustainable splits, or hiding poor execution behind total metres.

When in doubt, prefer coach judgement and transparent explanations over automatic reward cleverness.
