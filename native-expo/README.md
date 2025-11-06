# Doxa Prayer App - React Native + Expo Prototype

This is a prototype mobile app built with React Native and Expo SDK 54. All data is hardcoded - no API calls are made.

## Features

- Campaign selection and subscription
- Prayer feed with daily content
- Prayer fuel content viewer with JSON-based rendering
- Reminder scheduling UI (no actual notifications sent)
- Multi-language support per campaign
- Campaign management

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

4. Run on Android:
```bash
npm run android
```

## Project Structure

- `app/` - Expo Router screens
- `src/components/` - Reusable React components
- `src/data/` - Hardcoded data (campaigns, fuel, groups, languages)
- `src/state/` - Zustand store for app state
- `src/utils/` - Utility functions
- `src/theme.ts` - Theme configuration

## Notes

- This is a prototype with no API integration
- Reminders are UI-only and do not send actual notifications
- All data is stored locally using AsyncStorage
- No authentication or backend services
- Uses Expo SDK 54 with latest compatible dependencies

