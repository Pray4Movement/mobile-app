<!-- 032414c6-d1cd-4a6c-818f-1891084cc77e f837ac8d-0373-4119-8208-5d18bddd9878 -->
# Ionic Vue Prototype (No APIs, Hard‑coded Data)

### Scope

- Uses Ionic + Vue (TypeScript) with Vue Router. No backend calls; all data hard-coded.
- UI for reminders only (no scheduling/notifications).
- Implements these screens from the requirements: `Campaign Chooser`, `Prayer Feed`, `Prayer Fuel`, `Campaigns`, plus a `Reminder Editor` UI.
- Persist simple preferences in `localStorage` only (for demo).

---

### Phase 0 — Prereqs & Tooling

- Install system deps:
  - Node.js LTS and npm
  - Ionic CLI and Capacitor tooling

Commands:

```bash
# Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v && npm -v

# Ionic CLI
npm install -g @ionic/cli

# (Optional) iOS/Android tooling
# macOS: Xcode via App Store, then: xcode-select --install
# Android: Install Android Studio; ensure ANDROID_HOME and platform tools on PATH
```

---

### Phase 1 — Project Bootstrap (CLI Only)

- Create Ionic Vue starter with Capacitor and routing:
```bash
ionic start prayer-prototype blank --type vue --capacitor --no-git --quiet
cd prayer-prototype
npm install
```

- Add platforms (optional for running on devices):
```bash
npx cap add ios
npx cap add android
```

- Start dev server:
```bash
ionic serve
```


Project structure to create/keep:

- `src/router/index.ts` — routes for all screens
- `src/pages/` — `CampaignChooser.vue`, `PrayerFeed.vue`, `PrayerFuel.vue`, `Campaigns.vue`, `ReminderEditor.vue`
- `src/components/` — shared UI: `SearchBar.vue`, `FilterChips.vue`, `CampaignCard.vue`, `JsonContentRenderer.vue`, `KebabMenu.vue`
- `src/data/` — hard-coded data: `campaigns.ts`, `groups.ts`, `languages.ts`, `fuel.ts`
- `src/store/` — minimal state helpers (or composables) `usePreferences.ts`, `useSubscriptions.ts`, `useReminders.ts`
- `src/utils/` — `date.ts`, `share.ts`

---

### Phase 2 — Routing & Shell

- Configure Ionic layout and tabs or menu per requirements:
  - Bottom tabs: `Prayer Feed`, `Campaigns`.
  - Global actions: share app, language switcher placeholder.
- Implement conditional initial route: if subscribed campaigns exist → `Prayer Feed`, else → `Campaign Chooser`.

Files:

- Update `src/main.ts` to include Ionic Vue and Router.
- Define routes in `src/router/index.ts` for all pages.

---

### Phase 3 — Hard‑coded Data Layer

- Create static data files in `src/data/` matching the examples:
  - `groups.ts`: Doxa Life, 110 Cities, Ramadan 2026, etc.
  - `campaigns.ts`: sample campaigns with `id`, `name`, `groupId`, `languages`, `shortDescription`.
  - `languages.ts`: list of language codes/names.
  - `fuel.ts`: per-campaign per-day JSON-like blocks (headings, lists, paragraphs, images).
- No API calls—screens import from these files.

---

### Phase 4 — Screens

- `CampaignChooser.vue`
  - Search bar, language filter, group filter chips, campaign code input.
  - Grouped list with counts that update as filters change.
  - Tap campaign → subscribe (store locally) and navigate to `Prayer Feed`.

- `PrayerFeed.vue`
  - Show current reminder schedule summary (read-only) with edit button.
  - Aggregate daily items across subscribed campaigns.
  - Each item: campaign name, short description, button to open `Prayer Fuel`.
  - Visually mark items with `prayed = true` (✓).

- `PrayerFuel.vue`
  - Render content blocks from `fuel.ts` via `JsonContentRenderer`.
  - Buttons: share campaign (placeholder), change language (updates state only), `I prayed` toggles local `prayed` and navigates back.

- `Campaigns.vue`
  - List subscribed campaigns; each with kebab menu: unsubscribe, change language (state only), share.
  - Button: find new campaign → `CampaignChooser`.

- `ReminderEditor.vue`
  - UI to add/edit schedules (days of week, times). Store in local state only.
  - No notification scheduling.

---

### Phase 5 — Components

- `SearchBar.vue`: debounced input emitting term.
- `FilterChips.vue`: multi-select chips for languages/groups.
- `CampaignCard.vue`: campaign item with name, description, language badge.
- `JsonContentRenderer.vue`: renders simple block types: heading, paragraph, list, image, button.
- `KebabMenu.vue`: context menu with actions (emit events only).

---

### Phase 6 — State & Persistence (Local Only)

- Keep it simple with composables or a tiny store (no external libs needed):
  - `useSubscriptions.ts`: subscribe/unsubscribe, list subscriptions.
  - `usePreferences.ts`: language per campaign, app language.
  - `useReminders.ts`: list of reminder entries; CRUD; validate duplicates.
- Persist each to `localStorage` with JSON encode/decode; guard against parse errors.

---

### Phase 7 — UX Polish

- Apply Ionic theming (`variables.css`) to match brand basics.
- Empty states: no subscriptions, no reminders, no results after filtering.
- Loading/skeleton states (simple placeholders even for local data).
- Accessibility: labels, hit targets, color contrast.

---

### Phase 8 — Build & Run

- Web:
```bash
ionic serve
ionic build
```

- iOS (on macOS):
```bash
npx cap sync ios
npx cap open ios  # build/run from Xcode
```

- Android:
```bash
npx cap sync android
npx cap open android  # build/run from Android Studio
```


---

### Data Shapes (concise)

- `Campaign`: `{ id, name, groupId, languages: string[], shortDescription }`
- `FuelItem`: `{ id, campaignId, dateISO, blocks: Block[] }` where `Block` is one of `heading|paragraph|list|image|button`.
- `Reminder`: `{ id, label, daysOfWeek: number[], times: string[] }` (UI only).
- `Subscription`: `{ campaignId, language }`.

---

### Out of Scope (explicit)

- Any network/API calls
- Notification permissions and scheduling
- Auth, secure storage, analytics

### To-dos

- [ ] Install Node LTS and Ionic CLI via shell commands
- [ ] Create Ionic Vue app with Capacitor via CLI
- [ ] Set up Ionic shell, tabs/menu, and Vue Router routes
- [ ] Create static data files for groups, campaigns, languages, fuel
- [ ] Implement four core screens and reminder editor UI
- [ ] Build shared components (search, chips, card, renderer, menu)
- [ ] Add local composables and localStorage persistence
- [ ] Theme basics, empty states, a11y, and small polish
- [ ] Build web and prepare iOS/Android projects with Capacitor