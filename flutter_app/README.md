# Prayer App - Flutter Prototype

A Flutter mobile app prototype for viewing daily prayer content from prayer campaigns. This is a prototype with all data hardcoded and no API integration.

## Features

- **Campaign Chooser**: Browse and subscribe to prayer campaigns with search, filtering, and campaign code support
- **Prayer Feed**: View prayer fuel grouped by date with reminder management UI
- **Prayer Fuel**: View detailed prayer content with language switching
- **Campaigns Management**: Manage subscribed campaigns, change languages, and share
- **Reminders with Notifications**: Create and manage prayer reminders with local push notifications
- **Local Storage**: All app state is persisted locally using SharedPreferences

## Requirements Overview

- **Greyscale theme**: The UI uses an explicit greyscale color scheme with neutral tones (no color accents).

## Project Structure

```
lib/
├── main.dart                 # App entry point with navigation setup
├── models/                   # Data models
│   ├── campaign.dart
│   ├── fuel.dart
│   ├── group.dart
│   ├── reminder.dart
│   └── preferences.dart
├── data/                     # Hardcoded data
│   ├── campaigns_data.dart
│   ├── fuel_data.dart
│   ├── groups_data.dart
│   └── languages_data.dart
├── services/                 # Business logic
│   ├── data_service.dart
│   ├── storage_service.dart
│   └── state_service.dart
├── screens/                  # App screens
│   ├── campaign_chooser_screen.dart
│   ├── prayer_feed_screen.dart
│   ├── prayer_fuel_screen.dart
│   └── campaigns_screen.dart
├── widgets/                  # Reusable widgets
│   ├── campaign_card.dart
│   ├── filter_chips.dart
│   ├── json_content_renderer.dart
│   ├── kebab_menu.dart
│   ├── prayer_fuel_item.dart
│   ├── reminder_editor.dart
│   └── search_bar.dart
├── utils/                    # Utility functions
│   ├── date_utils.dart
│   └── share_utils.dart
└── theme.dart                # App theme
```

## Getting Started

### Prerequisites

- Flutter SDK (3.9.2 or later)
- Dart SDK (3.9.2 or later)

### Installation

1. Install dependencies:
```bash
flutter pub get
```

2. Run the app:
```bash
flutter run
```

## Building and Testing

### Prerequisites Check

1. Check Flutter installation:
```bash
flutter doctor
```
This will show what's set up and what might be missing.

2. Ensure you have:
   - Flutter SDK (3.9.2+)
   - Dart SDK (included with Flutter)
   - For Android: Android Studio + Android SDK
   - For iOS: Xcode (macOS only)
   - For Web: Chrome (usually auto-installed)
   - For Desktop: Platform-specific tools

### Setup and Run

1. Navigate to the project directory:
```bash
cd flutter_app
```

2. Get dependencies:
```bash
flutter pub get
```

3. Check available devices:
```bash
flutter devices
```

4. Run the app:

**On Android (emulator or device):**
```bash
flutter run
# Or specify device:
flutter run -d <device-id>
```

**On iOS (macOS only):**
```bash
flutter run -d ios
```

**On Web:**
```bash
flutter run -d chrome
# Or for web-server mode:
flutter run -d web-server --web-port 8080
```

**On Linux:**
```bash
flutter run -d linux
```

**On Windows:**
```bash
flutter run -d windows
```

**On macOS:**
```bash
flutter run -d macos
```

### Testing the App

#### Manual Testing Flow

1. **First Launch**: Should show Campaign Chooser (no subscriptions yet)
2. **Subscribe to Campaign**: Tap "Subscribe" on any campaign
3. **After First Subscription**: Should navigate to Prayer Feed automatically
4. **Prayer Feed**:
   - View prayer fuel grouped by date
   - Add a reminder (tap "Add Reminder")
   - Edit/delete reminders
   - Tap a prayer fuel item to view details
5. **Prayer Fuel Screen**:
   - View content
   - Switch language (if available)
   - Mark as prayed
   - Share functionality
6. **Campaigns Screen**:
   - View subscribed campaigns
   - Use kebab menu (three dots) to unsubscribe, change language, or share
   - Find new campaigns
7. **Navigation Drawer**: Access from any main screen (hamburger menu)

#### Hot Reload

While the app is running:
- Press `r` in the terminal for hot reload
- Press `R` for hot restart
- Press `q` to quit

### Build for Release

#### Android APK:
```bash
flutter build apk
# Output: build/app/outputs/flutter-apk/app-release.apk

# For split APKs (smaller size):
flutter build apk --split-per-abi
```

#### Android App Bundle (for Play Store):
```bash
flutter build appbundle
# Output: build/app/outputs/bundle/release/app-release.aab
```

#### iOS (macOS only):
```bash
flutter build ios
# Then open ios/Runner.xcworkspace in Xcode to archive
```

#### Web:
```bash
flutter build web
# Output: build/web/
# Deploy the contents of build/web/ to your web server
```

#### Linux:
```bash
flutter build linux
# Output: build/linux/x64/release/bundle/
```

#### Windows:
```bash
flutter build windows
# Output: build/windows/x64/runner/Release/
```

### Troubleshooting

1. **If dependencies fail:**
```bash
flutter clean
flutter pub get
```

2. **If build fails:**
```bash
flutter doctor -v  # Check for issues
flutter clean
flutter pub get
flutter run
```

3. **Check for errors:**
```bash
flutter analyze
```

4. **Check device connection:**
```bash
# For Android:
adb devices

# For iOS:
xcrun simctl list devices
```

### Quick Test Checklist

- [ ] App launches without errors
- [ ] Campaign Chooser displays all campaigns
- [ ] Search and filters work
- [ ] Can subscribe to campaigns
- [ ] Prayer Feed shows subscribed campaign fuel
- [ ] Can create/edit/delete reminders
- [ ] Can view prayer fuel details
- [ ] Can mark fuel as prayed
- [ ] Language switching works
- [ ] Share functionality works
- [ ] Navigation drawer works
- [ ] State persists after app restart

### Development Tips

1. **Enable debug mode**: Already enabled by default when using `flutter run`
2. **View logs**: Check terminal output or use `flutter logs`
3. **Inspect widget tree**: Use Flutter DevTools (run `flutter pub global activate devtools` then `flutter pub global run devtools`)
4. **Test state persistence**: Close and reopen the app to verify data is saved

## Key Implementation Notes

- **No API Calls**: All data is hardcoded in Dart files
- **Local Push Notifications**: Reminders schedule actual local notifications that fire at the specified times
- **Notification Permissions**: The app requests notification permissions on first launch (Android 13+ and iOS)
- **Notification Taps**: Tapping a notification opens the app and navigates to the Prayer Feed
- **Weekly Recurring**: Notifications repeat weekly on the selected days
- **Local Storage**: Uses SharedPreferences for persistence
- **State Management**: Uses Provider for state management
- **Navigation**: Uses named routes with conditional initial routing

## Dependencies

- `provider`: State management
- `shared_preferences`: Local storage
- `intl`: Date formatting
- `share_plus`: Sharing functionality
- `flutter_local_notifications`: Local push notifications
- `timezone`: Timezone support for scheduled notifications

## Screens

### Campaign Chooser
- Search campaigns by name
- Filter by language and group
- Enter campaign code to find specific campaigns
- Subscribe to campaigns

### Prayer Feed
- View prayer fuel grouped by date
- Manage reminders (create, edit, delete) with actual push notifications
- Visual indicators for prayed items
- Navigate to prayer fuel details
- Tap notifications to open the app and view prayer content

### Prayer Fuel
- View detailed prayer content
- Switch languages per campaign
- Mark as prayed
- Share prayer fuel

### Campaigns
- View subscribed campaigns
- Unsubscribe from campaigns
- Change language per campaign
- Share campaigns

## Notification Features

### How It Works

1. **Creating Reminders**: When you create a reminder, the app schedules local notifications for each selected day of the week at the specified time.

2. **Weekly Recurrence**: Notifications automatically repeat every week on the selected days.

3. **Notification Content**:
   - If the reminder is for a specific campaign, the notification title includes the campaign name
   - If the reminder is for all campaigns, it shows a generic "Prayer Reminder" title
   - The notification body prompts you to tap to view today's prayer content

4. **Notification Taps**: When you tap a notification, the app opens and navigates to the Prayer Feed screen where you can view today's prayer content.

5. **Permissions**:
   - On Android 13+, the app requests notification permission on first launch
   - On iOS, notification permissions are requested when the app first tries to schedule a notification

### Notification Behavior in Different App States

The app handles notifications differently depending on whether the app is open, in the background, or closed:

#### When App is Open (Foreground)
- **Android**: Notifications appear in the system notification tray with sound and vibration
- **iOS**: Notifications appear as banners/alerts at the top of the screen
- Tapping the notification navigates to the Prayer Feed screen
- The notification callback is triggered immediately

#### When App is in Background
- Notifications appear in the system notification tray
- Sound and vibration play (if enabled)
- Tapping the notification opens the app and navigates to the Prayer Feed screen
- The app handles the notification tap when it comes to foreground

#### When App is Closed/Terminated
- Notifications appear in the system notification tray
- Sound and vibration play (if enabled)
- Tapping the notification launches the app and navigates to the Prayer Feed screen
- The app detects it was launched from a notification and handles navigation accordingly

#### Key Points
- Notifications work in all app states (foreground, background, terminated)
- The notification system handles display automatically - no special code needed for foreground vs background
- All notifications use the same channel with high importance, ensuring they're always visible
- Notification taps are handled consistently regardless of app state

### Testing Notifications

To test notifications:
1. Create a reminder for a time a few minutes in the future
2. Wait for the notification to appear
3. Tap the notification to verify it opens the app
4. Check that notifications repeat on the selected days

**Note**: On Android, you may need to grant "Exact alarm" permission in system settings for notifications to work reliably.

## Development Notes

This is a prototype application. For production use, you would need to:
- Integrate with prayer.tools API
- Add authentication/authorization
- Add error handling for network requests
- Add loading states
- Add offline support with proper caching
- Handle notification permissions more gracefully with user-friendly dialogs
- Add background service to reschedule notifications after device reboot
