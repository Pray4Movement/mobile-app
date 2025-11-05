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

## Data Storage

- Local storage for subscribed campaigns list
- Store user reminder schedules (times, days, preferences)
- Cache prayer fuel content for offline access
- Store user preferences (language selection, notification settings)
- Store app state (last viewed campaign, navigation state)

## Push Notifications

- Schedule local notifications at user-defined times
- Handle notification taps (deep linking to specific prayer content)
- Support multiple notification schedules per user
- Handle notification permissions on both platforms
- Background notification scheduling

## Navigation & Routing

- Multi-screen navigation (Campaign Chooser, Prayer Feed, Prayer Fuel, Campaigns)
- Deep linking from notifications to specific content
- Conditional initial routing (subscribed vs. not subscribed)
- Back navigation handling

## UI Components

- Search bar with real-time filtering
- Filter buttons (by language, by group)
- Campaign code input field
- Grouped list views with section headers
- Kebab menu (context menu) for campaign actions
- Customizable reminder schedule UI
- JSON-based content renderer (headings, lists, images, buttons)
- Language selector/switcher
- Share functionality (app sharing, campaign sharing)

## Business Logic

- Campaign subscription management (subscribe/unsubscribe)
- Multi-campaign support per user
- Prayer fuel aggregation by day across campaigns
- Campaign grouping and filtering logic
- Language switching per campaign
- Prayer session tracking (start/end timestamps)

## Platform-Specific Features

- Android and iOS app store deployment
- Platform-specific notification handling
- Platform-specific sharing mechanisms
- Platform-specific storage (secure storage for sensitive data)

