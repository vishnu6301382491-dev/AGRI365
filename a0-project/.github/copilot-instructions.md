# Copilot Instructions for agri365 a0-project

## Project Overview
This is a React Native app (using Expo) for agricultural workflows, featuring multiple screens for weather, pest identification, market prices, diagnostics, and community features. Navigation is managed via React Navigation (stack and tab navigators). State is mostly local, with some integration points for Supabase and other APIs.

## Key Architecture
- **Entry Point:** `App.tsx` sets up navigation and authentication state. Uses a stack navigator to switch between Auth and main app tabs.
- **Navigation:**
  - `screens/TabNavigator.tsx` defines the main tab bar and routes to all major screens.
  - Each screen (e.g., `HomeScreen.tsx`, `MarketPricesScreen.tsx`) is in `screens/` and is a functional React component.
- **Authentication:** Managed in `App.tsx` with local state. The `AuthScreen` triggers login, and `onLogout` is passed to `ProfileScreen` via props.
- **UI Patterns:**
  - Uses `@expo/vector-icons` for tab icons.
  - Consistent use of `SafeAreaProvider` and `react-native-safe-area-context`.
  - Toaster notifications via `sonner-native`.
- **Testing:**
  - Tests are in `__tests__/` and use Jest with TypeScript (`ts-jest`).
  - Test files must be named `*.test.ts`.
  - Jest config: see `jest.config.js` (test env: node, setup: `setupTests.js`).

## Developer Workflows
- **Start app:**
  - `npm run start` (launches Expo dev server)
  - `npm run android` or `npm run ios` to run on device/emulator
  - `npm run web` for web preview
- **Run tests:**
  - `npx jest` (or use VS Code Jest extension)
- **Type checking:**
  - `tsconfig.json` enforces strict mode, ES2020 target

## Conventions & Patterns
- **Screen Components:**
  - All screens are in `screens/` and exported as default.
  - Tab and stack navigation names must match those in `TabNavigator.tsx` and `App.tsx`.
- **Props:**
  - Navigation and auth props are passed explicitly, not via context.
- **Styling:**
  - Uses `StyleSheet.create` and inline styles, with dark backgrounds and green accents (`#4CAF50`).
- **Testing:**
  - Prefer `@testing-library/jest-dom` for DOM assertions (see `setupTests.js`).
  - Use TypeScript for all tests.

## External Integrations
- **Supabase:** Used for backend data (see `@supabase/supabase-js` in `package.json`).
- **Expo:** Core runtime, camera, and vector icons.

## Examples
- To add a new screen, create `screens/FooScreen.tsx`, add it to `TabNavigator.tsx` and/or `App.tsx` stack.
- To add a new test, create `__tests__/foo.test.ts`.

---
For more details, see `App.tsx`, `screens/TabNavigator.tsx`, and `jest.config.js`.
