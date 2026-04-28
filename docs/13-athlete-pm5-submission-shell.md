# Athlete PM5 Submission Shell

## What Was Added

Step 6 adds a preview-only athlete PM5 evidence submission screen shell:

- `src/screens/athlete/AthleteSubmissionShellScreen.tsx`
- `src/components/game/PM5EvidencePanel.tsx`
- `src/components/game/ReflectionDraftPanel.tsx`
- `src/components/game/SubmissionReadinessPanel.tsx`
- `app/athlete/submission.tsx`

It also updates `src/screens/athlete/AthleteTodaysQuestScreen.tsx` so athletes can open this preview shell from Today’s Quest.

## How This Supports The DRIVE Brief

The shell makes the next step in the MVP loop visible without pretending the workflow is complete:

- It reads mock quest and submission data to show context.
- It frames PM5 evidence and reflection as part of serious training quality.
- It reinforces the coach verification gate before rewards unlock.
- It keeps copy focused on honest evidence, short useful reflection, and healthy training behaviour.

This supports DRIVE’s core philosophy: reward coach verified execution quality, not unverified completion.

## Why Upload And Submit Are Still Disabled

Upload and final submit actions are intentionally disabled because this step is a shell preview only.

The screen communicates future flow shape but does not implement:

- real photo capture or upload
- real submission writes
- verification actions
- reward workflows

This avoids false signals and protects roadmap scope.

## Why Reflections Stay Short And Training Focused

The reflection panel uses short, practical prompt language so reflections stay useful for coaching and session quality review.

It avoids diary-style prompts, sensitive personal disclosure patterns, and overlong input burden for junior athletes.

## Why PM5 Evidence Is Private

PM5 evidence copy states that photos are private training evidence for squad and coach review.

No social sharing, public galleries, or messaging features are added. This aligns with safeguarding requirements for junior athlete data handling.

## Why Rewards Remain Verification-Gated

The shell explicitly states that rewards unlock only after coach verification and that unverified submissions stay awaiting coach review.

No reward logic or trusted progress/reward writes are called from athlete-facing UI.

## What Future Agents Must Not Infer

Future agents must not infer from this shell that:

- real PM5 upload is implemented
- athlete final submit workflow is implemented
- coach verification actions are implemented
- reward calculation or progress updates are implemented
- Firebase, authentication, or storage integration exists

This step is UI framing for a future workflow, not a completed workflow.

## Deliberately Out Of Scope

This step intentionally excludes:

- Firebase
- authentication
- real PM5 photo upload
- Firebase Storage
- real submit workflow
- coach verification actions
- reward calculation
- leaderboards
- OCR, Concept2 API, live PM5 Bluetooth, Unity, Godot, messaging, and social features
