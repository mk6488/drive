# UI And Navigation Shell

## What Was Added

Step 3 adds a static Expo Router UI shell for DRIVE: Winter Quest:

- A central theme in `src/constants/theme.ts`.
- Reusable UI primitives for screens, cards, text, buttons, and status pills.
- Presentational game-flavoured components for attribute chips and game panels.
- Static welcome, athlete preview, and coach preview screens.
- Routes for `/`, `/athlete`, and `/coach`.

## Deliberately Not Implemented

This step does not add:

- Firebase code.
- Authentication or real login.
- Quest creation.
- PM5 upload.
- Coach verification actions.
- Reward calculations.
- Attribute progression.
- Squad missions, River Map, or Boathouse workflows.
- Leaderboards, messaging, social features, OCR, Concept2 API, live PM5 Bluetooth, Unity, or Godot.

## Visual Direction

The shell uses a dark river training atmosphere, warm parchment cards, and muted bronze or gold accents. The intent is a serious indie rowing game feel: simple, bold, readable, and rooted in coach verified winter training rather than a generic fitness app.

## Placeholder Boundaries

Future agents must not infer working workflows from these screens. The athlete PM5 area is a future upload placeholder only. The coach verification area is role framing only. Attribute chips do not represent real values, reward logic, or progress. Navigation between preview screens is the only active behaviour added in this step.
