# Technical Requirements

## Data Fetching & API Integration

- REST API client for HTTP requests
- Fetch campaign directory from `prayer.tools` API
- Fetch prayer fuel content from `prayer.fuel` directory API
- Fetch JSON data for specific campaign/day endpoints
- POST to prayer.tools API to track prayer session start
- POST to prayer.tools API to track prayer session end
- Handle network errors and retry logic
- Support for authentication/authorization if required by APIs
- **Campaign Filtering**: Client-side filtering of campaigns based on app variant (Doxa app filters to "doxa-life" group, General app shows all campaigns)

## Data Storage

- Local storage for subscribed campaigns list
- Store user reminder schedules (times, days, preferences)
- Cache prayer fuel content for offline access
- Store user preferences (language selection, notification settings)
- Store prayer completion status per campaign/day for visual indicators
- Store app state (last viewed campaign, navigation state)

## Push Notifications

- Schedule local notifications at user-defined times
- Handle notification taps (deep linking to the relevant campaign's current-day prayer content)
- Support multiple notification schedules per user
- Handle notification permissions on both platforms
- Background notification scheduling

## Navigation & Routing

- Multi-screen navigation (Campaign Chooser, Prayer Feed, Prayer Fuel, Campaigns)
- Deep linking from notifications to specific content
- Conditional initial routing (subscribed vs. not subscribed)
- Back navigation handling
- Campaign chooser exit paths (back button, return to Campaigns tab)

## UI Components

- Search bar with real-time filtering
- Filter buttons (by language, by group)
- Campaign code input field
- Grouped list views with section headers
- Dynamic campaign count indicator that updates with filters
- Kebab menu (context menu) for campaign actions
- Customizable reminder schedule UI
- Reminder schedule summary component on the Prayer Feed
- JSON-based content renderer (headings, lists, images, buttons)
- Language selector/switcher
- Share functionality (app sharing, campaign sharing)
- Subscribed campaign badge styling in chooser listings
- Prayer status indicator with checkmark for days marked as prayed

## Business Logic

- Campaign subscription management (subscribe/unsubscribe)
- Multi-campaign support per user
- Prayer fuel aggregation by day across campaigns
- Campaign grouping and filtering logic
- Language switching per campaign
- Prayer session tracking (start/end timestamps)
- Prayer completion state management to drive "I prayed" button states and feed indicators

## Platform-Specific Features

- Android and iOS app store deployment
- Platform-specific notification handling
- Platform-specific sharing mechanisms
- Platform-specific storage (secure storage for sensitive data)

## Multi-Build Configuration

The app supports building two variants (Doxa and General) from a single codebase using a configuration-based approach.

### Configuration System

- **App Configuration**: Runtime configuration loaded based on `APP_VARIANT` build argument
  - `DoxaConfig`: Filters campaigns to "doxa-life" group, uses Doxa branding
  - `GeneralConfig`: Shows all campaigns except doxa-life, uses general branding
- **Build-time Configuration**: Set via `--dart-define=APP_VARIANT={variant}` and `--flavor {variant}` flags

### Variant Differences

**Doxa Variant:**
- Campaign filter: Only "doxa-life" group campaigns
- App name: "Doxa Prayer"
- Bundle IDs: `com.doxa.prayer` (Android/iOS)
- Branding: Doxa-specific theme colors, icons, splash screens

**General Variant:**
- Campaign filter: All campaigns (no group restriction)
- App name: "Prayer App"
- Bundle IDs: `com.prayer.app` (Android/iOS)
- Branding: General theme colors, icons, splash screens

### Asset Management

**Flutter Assets:**
- Stored in `branding/{variant}/` folders
- Copied to `branding/current/` at build time
- Only selected variant's assets included in final bundle

**Android Assets:**
- Uses native product flavors (`doxa` and `general`)
- Resources in `android/app/src/{flavor}/res/` automatically merged by Gradle
- Flavor-specific icons, strings, and drawables

**iOS Assets:**
- Stored in `ios/assets/{variant}/Assets.xcassets/`
- Copied to `ios/Runner/Assets.xcassets/` at build time
- Variant-specific app icons and launch images

### Build Process

**Build Scripts:**
- `scripts/copy_branding.sh`: Copies variant-specific assets (Flutter and iOS)
- `scripts/build_doxa.sh`: Builds Doxa variant for specified platform
- `scripts/build_general.sh`: Builds General variant for specified platform

**Build Commands:**
```bash
# Build Doxa variant
./scripts/build_doxa.sh [apk|appbundle|ios]

# Build General variant
./scripts/build_general.sh [apk|appbundle|ios]
```

**Build Steps:**
1. Copy variant-specific Flutter assets to `branding/current/`
2. Copy variant-specific iOS assets to `ios/Runner/Assets.xcassets/` (for iOS builds)
3. Build with Flutter using `--dart-define=APP_VARIANT={variant}` and `--flavor {variant}`

### Campaign Filtering Implementation

- `DataService.getAvailableCampaigns()`: Filters campaigns based on `AppConfig.current.campaignGroupFilter`
- `DataService.getAvailableGroups()`: Filters groups to only those with available campaigns
- Campaign chooser automatically uses filtered campaigns based on app variant
- Filtering happens at runtime based on configuration loaded at app startup

