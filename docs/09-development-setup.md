# Development Setup

## Expo Foundation

The Step 2 app foundation was created from the official Expo create app command:

```bash
npx create-expo-app@latest drive-expo-temp --template default --no-install --yes
```

The generated foundation was moved into the repository root while preserving the existing DRIVE documentation, `.cursor/rules/`, `.git/`, README guardrails, and `.gitignore` entries. The temporary Expo folder is not part of the project.

## Useful Commands

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm run start
```

Start a platform target:

```bash
npm run ios
npm run android
npm run web
```

Run typecheck:

```bash
npm run typecheck
```

Run lint:

```bash
npm run lint
```

## Deliberately Not Added

This step adds only the Expo React Native TypeScript foundation, a minimal DRIVE placeholder screen, and the intended source folder boundaries.

The following are deliberately not part of this step:

- Firebase implementation
- Quest workflows
- PM5 upload workflows
- Reward logic
- Coach verification workflows
- Leaderboards
- Messaging
- OCR
- Concept2 API integration
- Live PM5 Bluetooth
- Unity or Godot

Future implementation must continue to follow the DRIVE docs and `.cursor/rules/` before adding product behaviour.
