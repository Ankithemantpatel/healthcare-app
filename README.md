# CareBridge Healthcare App

Monorepo for a healthcare product with React Native mobile and React web apps.

## Workspace Layout

- `apps/mobile`: React Native app (iOS and Android)
- `apps/web`: React web app
- `packages/shared`: shared models and utility logic
- `packages/api`: API package scaffold

## Tech Stack

- Monorepo workspaces (npm)
- TypeScript + JavaScript mix
- Redux Toolkit for state management
- Turbo for task orchestration
- React Native `0.72.17` for mobile

## Implemented Mobile Features

- Authentication flow (login/register)
- Dashboard as authenticated home
- Hamburger drawer navigation
- Doctors directory and booking handoff
- Appointment booking and history
- Medicines catalog with:
  - search
  - category filtering
  - sorting
  - cart and checkout
- Profile management (including address)
- Health Records view
- Orders view with checkout-to-order flow
- Prescription PDF export from Health Records:
  - single prescription export
  - bulk export for all prescriptions
  - share sheet handoff after PDF generation

## Prerequisites

- Node.js 18+
- npm 9+
- Xcode (for iOS)
- CocoaPods (for iOS native dependencies)
- Android Studio (for Android builds)

## Install Dependencies

From repository root:

```bash
npm install
```

Install iOS pods:

```bash
cd apps/mobile/ios
pod install
```

## Run Mobile App

Start Metro (recommended from mobile package):

```bash
npm --prefix apps/mobile run start
```

Run iOS app:

```bash
npm --prefix apps/mobile run ios -- --simulator="iPhone 15 Pro Max"
```

Run Android app:

```bash
npm --prefix apps/mobile run android
```

## Run Web App

```bash
npm --prefix apps/web run start
```

## Build

Workspace build with Turbo:

```bash
npm run build
```

## State Management (Mobile)

Mobile Redux store currently includes:

- `auth`
- `doctors`
- `appointments`
- `profile`
- `medicines`
- `healthRecords`
- `orders`

## PDF Export Notes (iOS)

If prescription PDF export fails after dependency changes:

1. Reinstall pods:

```bash
cd apps/mobile/ios && pod install
```

2. Clean DerivedData:

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData/CareBridgeMobile*
```

3. Rebuild the app:

```bash
npm --prefix apps/mobile run ios -- --simulator="iPhone 15 Pro Max"
```

## Known Follow-Ups

- Add automated tests for reducers and screen-level flows.
- Replace mock API with real backend integration.
- Add CI pipeline for lint/build/test and app packaging.
