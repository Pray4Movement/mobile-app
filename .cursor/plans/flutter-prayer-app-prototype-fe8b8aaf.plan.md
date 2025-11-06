<!-- fe8b8aaf-58c9-4ae9-9c46-eee11766ee28 c30f1b8c-8f2e-48ca-bc8c-a7169590cb5d -->
# Flutter Prayer App Prototype Plan

## Overview

Build a Flutter mobile app prototype in `flutter-app/` folder with all data hardcoded, implementing the prayer campaign app UI without API calls or actual notifications. The app will have reminder creation UI but won't send notifications.

## Project Structure

```
flutter-app/
├── lib/
│   ├── main.dart
│   ├── models/
│   │   ├── campaign.dart
│   │   ├── fuel.dart
│   │   ├── group.dart
│   │   ├── reminder.dart
│   │   └── preferences.dart
│   ├── data/
│   │   ├── campaigns_data.dart
│   │   ├── fuel_data.dart
│   │   ├── groups_data.dart
│   │   └── languages_data.dart
│   ├── services/
│   │   ├── data_service.dart
│   │   ├── storage_service.dart
│   │   └── state_service.dart
│   ├── screens/
│   │   ├── campaign_chooser_screen.dart
│   │   ├── prayer_feed_screen.dart
│   │   ├── prayer_fuel_screen.dart
│   │   └── campaigns_screen.dart
│   ├── widgets/
│   │   ├── campaign_card.dart
│   │   ├── search_bar.dart
│   │   ├── filter_chips.dart
│   │   ├── kebab_menu.dart
│   │   ├── reminder_editor.dart
│   │   ├── json_content_renderer.dart
│   │   └── prayer_fuel_item.dart
│   ├── utils/
│   │   ├── date_utils.dart
│   │   └── share_utils.dart
│   └── theme.dart
├── pubspec.yaml
└── README.md
```

## Phase 1: Project Setup & Foundation

- Initialize Flutter project in `flutter-app/` directory
- Configure `pubspec.yaml` with dependencies:
  - `provider` or `riverpod` for state management
  - `shared_preferences` for local storage
  - `intl` for date formatting
  - `share_plus` for sharing functionality
- Set up folder structure (models, data, services, screens, widgets, utils)
- Create `main.dart` with MaterialApp setup and theme
- Set up basic navigation structure with routes

## Phase 2: Data Models & Hardcoded Data

- Create model classes:
  - `Campaign` (id, name, groupId, languages, shortDescription, code)
  - `Fuel` (id, campaignId, day, date, languages map)
  - `FuelBlock` (type, content, level, items, src, alt, label, action)
  - `FuelContent` (campaignId, day, date, language, blocks)
  - `Group` (id, name)
  - `Reminder` (id, time, days, campaignId)
  - `AppPreferences` (languageByCampaign map)
- Create hardcoded data files:
  - `campaigns_data.dart`: List of campaigns (Azeris, Uighur, Afghanistan, Malaysia, Paris, London, Cairo, Istanbul)
  - `groups_data.dart`: Groups (Doxa Life, 110 Cities, Ramadan 2026)
  - `fuel_data.dart`: Prayer fuel content for multiple campaigns with multiple days
  - `languages_data.dart`: Available languages list
- Create `DataService` class with helper methods:
  - `getCampaignById()`, `getCampaignByCode()`, `getCampaignsByGroup()`
  - `getFuelById()`, `getFuelByCampaignAndDay()`, `getFuelByCampaign()`, `getFuelByDate()`
  - `getGroupById()`, `getAllGroups()`

## Phase 3: State Management & Local Storage

- Create `StorageService` using `shared_preferences`:
  - Methods: `saveSubscribedCampaigns()`, `loadSubscribedCampaigns()`
  - Methods: `saveReminders()`, `loadReminders()`
  - Methods: `savePrayedStatus()`, `loadPrayedStatus()`
  - Methods: `savePreferences()`, `loadPreferences()`
- Create `AppState` class/model to hold:
  - `subscribedCampaignIds: List<String>`
  - `reminders: List<Reminder>`
  - `prayed: Map<String, bool>` (fuelId -> boolean)
  - `preferences: AppPreferences`
- Set up state management (Provider/Riverpod):
  - Create state provider/notifier
  - Implement actions: `subscribe()`, `unsubscribe()`, `addReminder()`, `updateReminder()`, `deleteReminder()`, `markPrayed()`, `unmarkPrayed()`, `setLanguage()`
  - Load state from storage on app start
  - Auto-save state on changes

## Phase 4: Core UI Components & Theme

- Create `theme.dart` with app theme (colors, text styles, spacing)
- Create reusable widgets:
  - `SearchBar`: Text field with search icon and clear button
  - `FilterChips`: Horizontal scrollable chips for language/group filters
  - `CampaignCard`: Card displaying campaign name, description, group badge
  - `KebabMenu`: Popup menu with actions (unsubscribe, change language, share)
  - `ReminderEditor`: UI for creating/editing reminders (time picker, day selector, campaign selector) - NO actual notification scheduling
  - `JsonContentRenderer`: Widget that renders FuelBlocks (headings, paragraphs, lists, images, buttons)
  - `PrayerFuelItem`: List item for prayer feed showing campaign, description, day, prayed status

## Phase 5: Campaign Chooser Screen

- Implement search bar that filters campaigns by name in real-time
- Add language filter chips (filter campaigns by available languages)
- Add campaign code input field (filters to specific campaign when code matches)
- Add group filter buttons (Doxa Life, 110 Cities, Ramadan 2026)
- Display campaign count that updates as filters are applied
- Show grouped list of campaigns with section headers
- Each campaign card should have subscribe button
- Handle subscription action (adds to subscribed campaigns, navigates to feed if first subscription)
- Implement conditional navigation: if no subscriptions, show chooser; if has subscriptions, show feed

## Phase 6: Prayer Feed Screen

- Display reminder schedule section at top:
  - Show list of active reminders (time, days, campaign)
  - "Edit Reminders" button that opens reminder editor
- Implement reminder editor UI:
  - Time picker for reminder time
  - Day selector (checkboxes for days of week)
  - Optional campaign selector (or "All campaigns")
  - Save/Cancel buttons
  - Note: UI only, no actual notification scheduling
- Display prayer fuel list grouped by date:
  - Group fuel items by date
  - Each item shows: campaign name, short description, day number, "View" button
  - Visual indicator (checkmark icon + distinct styling) for prayed items
  - Tap item to navigate to Prayer Fuel screen
- Add navigation menu to access Campaigns screen

## Phase 7: Prayer Fuel Screen

- Accept campaign ID and day as parameters
- Fetch fuel content using `DataService`
- Render content using `JsonContentRenderer`:
  - Headings (h1, h2, etc. based on level)
  - Paragraphs
  - Lists (bulleted)
  - Images (placeholder for now, or use network images if URLs provided)
  - Buttons (display only, no actions needed for prototype)
- Add app bar with:
  - Back button
  - Share button (share campaign using `share_plus`)
  - Language switcher (dropdown to change language for this campaign)
- Display "I prayed" button at bottom:
  - If not prayed: shows "I prayed" button
  - If already prayed: shows "✓ Prayed" (disabled style)
  - On tap: marks fuel as prayed, saves state, navigates back to feed

## Phase 8: Campaigns Screen

- Display list of subscribed campaigns
- Each campaign shows:
  - Campaign name and description
  - Current language setting
  - Kebab menu icon
- Kebab menu actions:
  - Unsubscribe (removes from subscriptions, shows confirmation)
  - Change Language (opens language picker for that campaign)
  - Share (shares campaign using `share_plus`)
- Add "Find New Campaign" button at bottom that navigates to Campaign Chooser
- Add navigation menu to access Prayer Feed

## Phase 9: Navigation & App-Wide Features

- Implement bottom navigation or drawer menu:
  - Prayer Feed (home)
  - Campaigns
  - Campaign Chooser (if not subscribed, or as "Find Campaign" option)
- Add app-level language switcher (if needed beyond per-campaign)
- Implement share app functionality
- Handle initial routing:
  - On app start: check if user has subscriptions
  - If yes: navigate to Prayer Feed
  - If no: navigate to Campaign Chooser
- Add proper back navigation handling
- Polish UI with consistent spacing, colors, and animations

## Phase 10: Testing & Polish

- Test all navigation flows
- Test state persistence (close app, reopen, verify data saved)
- Test filtering and search functionality
- Test reminder editor (create, edit, delete reminders)
- Test prayer marking (mark as prayed, verify UI updates)
- Test language switching per campaign
- Test subscription/unsubscription flows
- Verify all hardcoded data displays correctly
- Add error handling for edge cases
- Polish UI/UX with consistent styling

## Key Implementation Notes

- All data is hardcoded in Dart files (no API calls)
- Reminder UI exists but does NOT schedule actual notifications
- Local storage persists: subscriptions, reminders, prayed status, language preferences
- State management handles all app state and auto-saves to local storage
- Navigation uses Flutter's Navigator with named routes or go_router
- JSON content renderer handles all FuelBlock types from hardcoded data
- Language switching updates displayed content immediately
- Share functionality uses `share_plus` package for platform-native sharing

### To-dos

- [ ] Initialize Flutter project in flutter-app/, configure pubspec.yaml with dependencies (provider/riverpod, shared_preferences, intl, share_plus), set up folder structure, create main.dart with MaterialApp and basic navigation
- [ ] Create all model classes (Campaign, Fuel, FuelBlock, FuelContent, Group, Reminder, AppPreferences) and hardcoded data files (campaigns_data.dart, fuel_data.dart, groups_data.dart, languages_data.dart) with sample data, create DataService with helper methods
- [ ] Create StorageService using shared_preferences for persistence, create AppState model, set up state management (Provider/Riverpod) with all actions (subscribe, unsubscribe, addReminder, markPrayed, setLanguage, etc.), implement auto-save on state changes
- [ ] Create theme.dart, build reusable widgets: SearchBar, FilterChips, CampaignCard, KebabMenu, ReminderEditor (UI only, no notifications), JsonContentRenderer, PrayerFuelItem
- [ ] Implement Campaign Chooser screen with search bar, language filter chips, campaign code input, group filter buttons, campaign count display, grouped campaign list, subscribe functionality, conditional navigation logic
- [ ] Implement Prayer Feed screen with reminder schedule display, reminder editor UI, prayer fuel list grouped by date, visual indicators for prayed items, navigation to Prayer Fuel screen
- [ ] Implement Prayer Fuel screen with JSON content rendering, share button, language switcher, I prayed button with state management, navigation back to feed
- [ ] Implement Campaigns screen with subscribed campaigns list, kebab menu (unsubscribe, change language, share), Find New Campaign button
- [ ] Implement app-wide navigation menu/drawer, handle initial routing based on subscription status, add share app functionality, polish navigation flows
- [ ] Test all flows, verify state persistence, test filtering/search, test reminder editor, test prayer marking, test language switching, polish UI/UX, add error handling