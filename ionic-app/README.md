# Prayer App - Ionic Vue Prototype

A prototype mobile prayer app built with Ionic and Vue, featuring hard-coded data and no API dependencies.

## Features

- **Campaign Chooser**: Browse and search prayer campaigns, filter by group and language
- **Prayer Feed**: View daily prayer content from subscribed campaigns
- **Prayer Fuel**: Read detailed prayer content for specific days
- **Campaigns Management**: Manage your subscribed campaigns
- **Reminders**: Create and manage prayer reminders (UI only, no notifications)

## Tech Stack

- **Ionic Vue**: Mobile-first UI framework
- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Capacitor**: Native app runtime
- **Vue Router**: Client-side routing

## Project Structure

```
src/
├── components/       # Reusable UI components
├── composables/     # Vue composables for state management
├── data/           # Hard-coded data (campaigns, fuel, etc.)
├── pages/          # Screen components
├── router/         # Vue Router configuration
├── theme/          # Ionic theme variables
└── utils/          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js LTS (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
ionic serve
```

3. Build for production:
```bash
npm run build
```

### Running on Devices

#### iOS (macOS only)

```bash
npx cap sync ios
npx cap open ios
```

#### Android

```bash
npx cap sync android
npx cap open android
```

## Data

All data is hard-coded in the `src/data/` directory:
- `campaigns.ts`: Campaign definitions
- `groups.ts`: Campaign groups
- `languages.ts`: Supported languages
- `fuel.ts`: Prayer fuel content

## State Management

The app uses Vue composables with localStorage for persistence:
- `useSubscriptions`: Manage campaign subscriptions
- `usePreferences`: Store user preferences
- `useReminders`: Manage prayer reminders
- `usePrayed`: Track prayed items

## Notes

- This is a prototype with no API integration
- Reminders are UI-only (no actual notifications)
- All data is stored in localStorage
- No authentication or backend services

