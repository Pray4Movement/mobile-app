<!-- 8c8bdd4d-8c6f-4d36-a0db-60d0f53f64ff d18bb9f2-c484-40c6-847b-2bd6dae425b4 -->
# React Native (Bare) Prayer App Prototype Plan

## Prerequisites & Tool Installation

### Required Tools

1. **Node.js** (v18 or later)

   - Check: `node --version`
   - Install: Download from nodejs.org or use nvm

2. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

3. **Java Development Kit (JDK)** - For Android

   - Install JDK 17 (OpenJDK recommended)
   - Set JAVA_HOME environment variable

4. **Android Studio** - For Android development

   - Install Android Studio
   - Install Android SDK (API 33+)
   - Set ANDROID_HOME environment variable
   - Install Android emulator or connect physical device

5. **Xcode** (macOS only) - For iOS development

   - Install from Mac App Store
   - Install Xcode Command Line Tools: `xcode-select --install`
   - Install CocoaPods: `sudo gem install cocoapods`

6. **Watchman** (optional but recommended)
   ```bash
   # macOS
   brew install watchman
   # Linux
   # Follow instructions at https://facebook.github.io/watchman/docs/install
   ```


### Verify Installation

```bash
node --version
npm --version
react-native --version
java -version
# Android
echo $ANDROID_HOME
# iOS (macOS only)
xcodebuild -version
```

## Project Structure

```
react-native-app/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # Screen components
│   ├── navigation/          # Navigation setup
│   ├── data/                # Hardcoded mock data
│   ├── models/              # TypeScript interfaces
│   ├── services/            # State management & storage
│   ├── utils/               # Helper functions
│   └── theme/               # Styling constants
├── App.tsx                  # Root component
├── package.json
└── tsconfig.json
```

## Phase 1: Project Setup & Data Layer

### 1.1 Initialize React Native Project

```bash
npx react-native@latest init PrayerApp --template react-native-template-typescript
cd PrayerApp
```

### 1.2 Install Dependencies

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install --save-dev @types/react-native-vector-icons
```

### 1.3 Create Data Models

- `src/models/Campaign.ts` - Campaign interface
- `src/models/Fuel.ts` - Prayer fuel interface
- `src/models/Group.ts` - Campaign group interface
- `src/models/Language.ts` - Language interface
- `src/models/Reminder.ts` - Reminder schedule interface
- `src/models/UserState.ts` - User subscriptions and preferences

### 1.4 Create Hardcoded Data Files

- `src/data/campaigns.ts` - Campaign list with all example campaigns
- `src/data/fuel.ts` - Prayer fuel content for multiple campaigns and days
- `src/data/groups.ts` - Campaign groups (Doxa Life, 110 Cities, Ramadan 2026)
- `src/data/languages.ts` - Available languages

### 1.5 Create Data Service

- `src/services/DataService.ts` - Functions to query hardcoded data (getCampaignById, getFuelByDate, etc.)

## Phase 2: Navigation & Basic Screens

### 2.1 Setup Navigation

- `src/navigation/AppNavigator.tsx` - Main navigation container
- Implement Stack Navigator for screen transitions
- Implement conditional initial route (subscribed vs. not subscribed)
- Add bottom tab navigator for main menu (Prayer Feed, Campaigns)

### 2.2 Create Screen Scaffolds

- `src/screens/CampaignChooserScreen.tsx` - Empty scaffold
- `src/screens/PrayerFeedScreen.tsx` - Empty scaffold
- `src/screens/PrayerFuelScreen.tsx` - Empty scaffold
- `src/screens/CampaignsScreen.tsx` - Empty scaffold

### 2.3 Create State Management Service

- `src/services/StateService.ts` - Manage app state (subscribed campaigns, prayed items, reminders)
- Use AsyncStorage for persistence
- Functions: subscribeToCampaign, unsubscribeFromCampaign, markAsPrayed, getSubscribedCampaigns, etc.

### 2.4 Create Theme

- `src/theme/colors.ts` - Color palette
- `src/theme/typography.ts` - Font sizes and styles
- `src/theme/spacing.ts` - Spacing constants

## Phase 3: Campaign Chooser Screen

### 3.1 Create UI Components

- `src/components/SearchBar.tsx` - Search input with real-time filtering
- `src/components/FilterChips.tsx` - Language and group filter buttons
- `src/components/CampaignCard.tsx` - Campaign list item with "Subscribed" badge
- `src/components/CampaignCodeInput.tsx` - Input field for campaign code

### 3.2 Implement Campaign Chooser Logic

- Search functionality (filter by campaign name)
- Campaign code filtering (direct match)
- Language filter (dropdown or chips)
- Group filter (top-level buttons: Doxa Life, 110 Cities, Ramadan 2026)
- Campaign count display (updates with filters)
- Visual indication of subscribed campaigns
- Navigation to Prayer Feed on subscription
- Back button navigation

### 3.3 Group Campaigns by Sections

- Display campaigns grouped by their groupId
- Section headers for each group
- Filter to show only selected group's campaigns

## Phase 4: Prayer Feed Screen

### 4.1 Create UI Components

- `src/components/PrayerFuelItem.tsx` - List item for prayer fuel with campaign name, description, and "prayed" indicator
- `src/components/ReminderEditor.tsx` - UI for creating/editing reminder schedules (time pickers, day selectors)
- `src/components/ReminderDisplay.tsx` - Display current reminder schedule

### 4.2 Implement Prayer Feed Logic

- Display reminder schedule info at top
- Edit reminder button (opens ReminderEditor)
- Aggregate prayer fuel by date across all subscribed campaigns
- Group prayer fuel items by day
- Show campaign name and short description for each item
- Visual checkmark (✓) for prayed items
- Navigate to Prayer Fuel screen on item tap
- Mark as prayed functionality (updates state, no API call)

### 4.3 Date Grouping

- Group prayer fuel items by date
- Display date headers
- Sort by date (most recent first or chronological)

## Phase 5: Prayer Fuel Screen

### 5.1 Create UI Components

- `src/components/JsonContentRenderer.tsx` - Render fuel blocks (headings, paragraphs, lists, images, buttons)
- `src/components/LanguageSelector.tsx` - Language switcher dropdown
- `src/components/ShareButton.tsx` - Share functionality UI

### 5.2 Implement Prayer Fuel Logic

- Display prayer content for selected campaign and day
- Render JSON blocks (headings with levels, paragraphs, lists, images, buttons)
- Language switcher (changes displayed content language)
- Share button (UI only, no actual sharing)
- "I prayed" button at bottom
  - If not prayed: Shows "I prayed", marks as prayed, navigates back
  - If already prayed: Shows "✓ Prayed" (disabled state)
- Back navigation to Prayer Feed

### 5.3 Content Rendering

- Support all block types: heading (h1-h6), paragraph, list (ordered/unordered), image, button
- Proper styling for each block type
- Responsive layout

## Phase 6: Campaigns Screen

### 6.1 Create UI Components

- `src/components/KebabMenu.tsx` - Context menu component (unsubscribe, change language, share)
- `src/components/CampaignListItem.tsx` - Campaign item in subscribed list

### 6.2 Implement Campaigns Screen Logic

- Display list of subscribed campaigns
- Kebab menu for each campaign with options:
  - Unsubscribe (removes from subscriptions)
  - Change language (opens language selector)
  - Share (UI only)
- "Find New Campaign" button (navigates to Campaign Chooser)
- Empty state when no campaigns subscribed

### 6.3 Language Management

- Store selected language per campaign
- Update language preference in state
- Persist language choices

## Phase 7: Reminder UI (No Actual Notifications)

### 7.1 Reminder Editor Component

- Time picker(s) for reminder times
- Day selector (checkboxes for days of week)
- Campaign selector (which campaigns to include)
- Save/Cancel buttons
- Display current reminder schedule

### 7.2 Reminder Display

- Show active reminder schedule on Prayer Feed
- Display times and days
- Show which campaigns are included
- Edit button to modify schedule

### 7.3 State Management

- Store reminder schedules in AsyncStorage
- No actual notification scheduling (prototype only)
- UI validation for reminder times

## Phase 8: Polish & Testing

### 8.1 Navigation Menu

- Bottom tab bar or drawer menu
- Navigation to Prayer Feed and Campaigns screens
- Share app button (UI only)
- Language switcher (global app language)

### 8.2 Styling & UX

- Consistent styling across all screens
- Loading states (if needed for future API integration)
- Error states (for validation)
- Empty states (no campaigns, no prayer fuel)
- Responsive layouts for different screen sizes

### 8.3 Testing

- Test navigation flows
- Test subscription/unsubscription
- Test prayer fuel marking
- Test reminder creation/editing
- Test filtering and search
- Test on both Android and iOS (if possible)

### 8.4 Code Organization

- Ensure proper TypeScript types throughout
- Add comments for complex logic
- Organize imports
- Remove unused code

## Key Implementation Notes

- **No API Calls**: All data is hardcoded in data files
- **No Notifications**: Reminder UI exists but doesn't schedule actual notifications
- **Local Storage**: Use AsyncStorage for user state (subscriptions, prayed items, reminders)
- **Navigation**: Use React Navigation for all screen transitions
- **State Management**: Simple service-based state management with AsyncStorage persistence
- **TypeScript**: Full TypeScript support with proper interfaces
- **Platform Support**: Works on both Android and iOS

## File Structure Summary

```
src/
├── components/
│   ├── CampaignCard.tsx
│   ├── CampaignCodeInput.tsx
│   ├── CampaignListItem.tsx
│   ├── FilterChips.tsx
│   ├── JsonContentRenderer.tsx
│   ├── KebabMenu.tsx
│   ├── LanguageSelector.tsx
│   ├── PrayerFuelItem.tsx
│   ├── ReminderDisplay.tsx
│   ├── ReminderEditor.tsx
│   ├── SearchBar.tsx
│   └── ShareButton.tsx
├── data/
│   ├── campaigns.ts
│   ├── fuel.ts
│   ├── groups.ts
│   └── languages.ts
├── models/
│   ├── Campaign.ts
│   ├── Fuel.ts
│   ├── Group.ts
│   ├── Language.ts
│   ├── Reminder.ts
│   └── UserState.ts
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   ├── CampaignChooserScreen.tsx
│   ├── CampaignsScreen.tsx
│   ├── PrayerFeedScreen.tsx
│   └── PrayerFuelScreen.tsx
├── services/
│   ├── DataService.ts
│   └── StateService.ts
├── theme/
│   ├── colors.ts
│   ├── spacing.ts
│   └── typography.ts
└── utils/
    ├── dateUtils.ts
    └── shareUtils.ts
```

## Development Commands

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Type checking
npx tsc --noEmit

# Clean build (Android)
cd android && ./gradlew clean && cd ..

# Clean build (iOS)
cd ios && pod install && cd ..
```

### To-dos

- [x] 