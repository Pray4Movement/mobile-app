<!-- 60f55880-cd28-4ccb-9593-14e3656023a0 0759440e-7469-4d86-bc73-783d1b02ecdb -->
# Prayer App Prototype - Phased Implementation Plan

## Overview

Build a single-page application using vanilla HTML, JavaScript, and CSS with hardcoded mock data. All content uses Lorem Ipsum except campaign group names. The prototype demonstrates all UI screens and interactions without API calls or actual notifications.

## Project Structure

```
web/
├── index.html          # Main entry point
├── css/
│   └── styles.css      # All styling (grayscale theme)
├── js/
│   ├── app.js          # Main app logic, routing, state management
│   ├── data.js         # All hardcoded mock data (Lorem Ipsum)
│   ├── screens.js      # Screen rendering functions
│   └── utils.js        # Utility functions (filtering, formatting, etc.)
└── README.md           # Setup and usage instructions
```

## Phase 1: Foundation & Data Setup

**Goal**: Set up project structure, routing system, and mock data

### Tasks:

1. Create basic HTML structure with container for dynamic content
2. Implement simple client-side routing (hash-based or history API)
3. Create `data.js` with hardcoded mock data:

   - Campaign directory (10-15 campaigns with groups: "Doxa Life", "110 Cities", "Ramadan 2026")
   - Campaign names and descriptions use Lorem Ipsum
   - Prayer fuel dates (multiple days per campaign)
   - Campaign codes for filtering
   - All languages available: English, French, Spanish, Chinese (Simplified)

4. Set up basic state management (localStorage for subscriptions, reminders, app-level language, campaign-level languages)
5. Create navigation menu component (Prayer Feed, Campaigns buttons, share button, language switcher)
6. Implement conditional initial routing (redirect to Campaign Chooser if no subscriptions)

### Key Files:

- `index.html`: Basic structure, script imports
- `js/data.js`: Mock campaign data with Lorem Ipsum content
- `js/app.js`: Router, state management, initialization
- `css/styles.css`: Base styles, layout, navigation (grayscale theme)

---

## Phase 2: Campaign Chooser Screen

**Goal**: Implement campaign selection interface with filtering and search

### Tasks:

1. Render campaign list grouped by sections (Doxa Life, 110 Cities, Ramadan 2026)
2. Implement search bar with real-time filtering by campaign name
3. Add language filter dropdown/buttons
4. Create campaign code input field that filters list on match
5. Add top-level group filter buttons (show campaigns in selected group)
6. Implement "Subscribe" button for each campaign
7. Store subscriptions in localStorage
8. Navigate to Prayer Feed after subscription

### Mock Data Structure:

```javascript
campaigns: [
  {
    id: "campaign1",
    name: "Lorem ipsum dolor sit amet",
    group: "Doxa Life",
    languages: ["en", "fr", "es", "zh"],
    code: "LOREM001",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
  },
  // ... more campaigns (all with Lorem Ipsum names and descriptions)
]
```

### Key Files:

- `js/screens.js`: `renderCampaignChooser()` function
- `js/utils.js`: `filterCampaigns()`, `searchCampaigns()` functions

---

## Phase 3: Prayer Feed & Prayer Fuel Screens

**Goal**: Display prayer content list and individual prayer fuel pages

### Tasks:

1. **Prayer Feed Screen**:

   - Display reminder schedule summary (times, days - from localStorage)
   - "Edit Reminders" button (navigates to dedicated Reminder Config screen)
   - List prayer fuel grouped by day
   - Each item shows: campaign name (Lorem Ipsum), description (Lorem Ipsum), date, "View Prayer Fuel" button
   - Aggregate prayer fuel from all subscribed campaigns
   - **Sort by date with latest day at the top** (newest first)

2. **Prayer Fuel Screen**:

   - Hardcoded HTML structure with Lorem Ipsum content (no JSON rendering)
   - Display campaign name (Lorem Ipsum) and date header
   - Multiple paragraphs, headings, and lists of Lorem Ipsum text
   - "Share" button (alert/console for now)
   - Language selector dropdown (English, French, Spanish, Chinese)
   - Store selected language in localStorage per campaign
   - Display does not change (all content is Lorem Ipsum), but selection is stored
   - "I prayed" button (stores timestamp, navigates back to Prayer Feed)

3. Implement navigation between screens

### Mock Data Structure:

```javascript
// Simple date-based structure for prayer fuel
prayerFuel: {
  "campaign1": {
    "2024-01-15": { /* date available */ },
    "2024-01-16": { /* date available */ },
    // ... more dates
  }
}
// Content is hardcoded HTML on Prayer Fuel screen
```

### Key Files:

- `js/screens.js`: `renderPrayerFeed()`, `renderPrayerFuel()` functions
- `js/utils.js`: `aggregatePrayerFuel()` function (sorts by date, newest first)

---

## Phase 4: Campaigns Screen & Reminder Config Screen

**Goal**: Manage subscriptions and configure reminder schedules

### Tasks:

1. **Campaigns Screen**:

   - List all subscribed campaigns (with Lorem Ipsum names)
   - Kebab menu (three-dot menu) for each campaign with options:
     - "Unsubscribe" (remove from localStorage, return to chooser if none left)
     - "Change Language" (dropdown with English, French, Spanish, Chinese)
     - "Share Campaign" (alert/console)
   - Store selected language in localStorage per campaign
   - "Find New Campaign" button (navigate to Campaign Chooser)

2. **Reminder Config Screen** (dedicated screen, not modal):

   - Full screen for reminder configuration
   - Time picker inputs (multiple times per day)
   - Day selector (checkboxes for days of week)
   - "Save" button stores schedule in localStorage
   - Navigate back to Prayer Feed after saving
   - Display current schedule on Prayer Feed screen
   - No actual notification scheduling (just UI)

3. Implement kebab menu component (show/hide on click)
4. Add unsubscribe confirmation
5. Implement language switcher storage (app-level and campaign-level in localStorage)

### Key Files:

- `js/screens.js`: `renderCampaigns()`, `renderReminderConfig()` functions
- `js/utils.js`: `saveReminderSchedule()`, `getReminderSchedule()`, `saveLanguagePreference()` functions

---

## Phase 5: Polish & Styling

**Goal**: Complete UI/UX, responsive design, and final touches

### Tasks:

1. Complete CSS styling:

   - **Grayscale theme only** (no colors - black, white, grays)
   - Modern, clean design
   - Responsive layout (mobile-first approach)
   - Consistent typography using grayscale
   - Button styles, input fields, cards (grayscale)
   - Navigation menu styling (grayscale)
   - Dropdown animations (grayscale)

2. Add loading states and transitions between screens (grayscale)
3. Style hardcoded HTML content on Prayer Fuel screen (headings, paragraphs, lists)
4. Add empty states (no campaigns subscribed, no prayer fuel, etc.)
5. Implement share functionality UI (share modal/alert with app link)
6. Language switcher functionality:

   - App-level language switcher in navigation (stores in localStorage)
   - Campaign-level language switcher (stores in localStorage per campaign)
   - Both show: English, French, Spanish, Chinese (Simplified)
   - No actual content changes (all Lorem Ipsum), but selections are stored

7. Test all user flows and fix any navigation issues
8. Add basic error handling for edge cases

### Key Files:

- `css/styles.css`: Complete grayscale styling for all components
- `js/utils.js`: `formatDate()`, `saveLanguagePreference()`, `getLanguagePreference()` helper functions

---

## Technical Implementation Details

### Routing Strategy

Use hash-based routing (`#campaign-chooser`, `#prayer-feed`, `#prayer-fuel/:campaignId/:date`, `#campaigns`, `#reminder-config`) for simplicity and no server requirements.

### State Management

- Use `localStorage` for persistent data:
  - `subscribedCampaigns`: Array of campaign IDs
  - `reminderSchedule`: Object with times and days
  - `appLanguage`: App-level language preference ("en", "fr", "es", "zh")
  - `campaignLanguages`: Map of campaign ID to selected language ("en", "fr", "es", "zh")
- Use JavaScript object for in-memory state (current screen, selected filters, etc.)

### Mock Data Requirements

- 10-15 campaigns across 3 groups (group names: "Doxa Life", "110 Cities", "Ramadan 2026")
- All campaign names and descriptions use Lorem Ipsum
- 5-7 days of prayer fuel per campaign (dates only, content is hardcoded HTML)
- All languages available: English, French, Spanish, Chinese (Simplified)
- Prayer Fuel screen content is hardcoded HTML with Lorem Ipsum (no JSON rendering)

### Styling Requirements

- **Grayscale theme only**: Use black, white, and various shades of gray
- No colors whatsoever
- Modern, clean design with good contrast
- Responsive mobile-first approach

### Browser Compatibility

Target modern browsers (ES6+ features). No polyfills needed for prototype.

---

## Dependencies

None - Pure HTML, CSS, and vanilla JavaScript.