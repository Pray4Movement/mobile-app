<!-- fed207e2-2452-4980-8979-e314bf88a050 236a8ce2-fb99-4316-8046-53cbe58ae0bb -->
# React Native + Expo Prototype Plan (No APIs, Hardcoded Data)

## Scope and Constraints

- No network/API calls; all data hardcoded in `src/data/*`.
- Notifications are not sent; provide UI to create/edit reminder schedules only.
- Persistence optional; if used, simulate with `AsyncStorage`. Offline-first by definition.
- Target iOS and Android via Expo in development; no store deploy.

## SDK & Dependency Versions (Expo SDK 54)

- Node: 18+
- Expo: `~54.x`
- React Native: `0.76.x` (managed by Expo)
- React: `18.2.0`
- expo-router: `^3.7.4`
- expo-status-bar: `^1.12.1`
- react-native-screens: `~3.31.x`
- react-native-safe-area-context: `^4.10.x`
- @expo/vector-icons: `^14.x`
- @react-native-async-storage/async-storage: `^1.23.x`
- Dev: `babel-plugin-module-resolver@^5`, `typescript@~5.3`, `@babel/core@^7`
- Avoid direct `@react-navigation/*` (expo-router provides navigation)

## Project Structure

- `app/` (expo-router) screens: `index.tsx` (conditional entry), `campaigns.tsx`, `feed.tsx`, `fuel/[id].tsx`, `choose.tsx`, `reminders.tsx`
- `src/components/`: `SearchBar.tsx`, `FilterChips.tsx`, `CampaignList.tsx`, `CampaignCard.tsx`, `SectionList.tsx`, `KebabMenu.tsx`, `ReminderEditor.tsx`, `JsonContentRenderer.tsx`, `Header.tsx`
- `src/data/`: `campaigns.ts`, `groups.ts`, `fuel.ts`, `languages.ts`
- `src/state/`: `store.ts` (Zustand), shape: campaigns, subscriptions, reminders, prayed, prefs
- `src/utils/`: `format.ts`, `ids.ts`, `share.ts` (stub), `i18n.ts` (minimal)
- `assets/`: images for content renderer (optional)

## Phase 1 — Foundations

- Initialize Expo app (managed workflow) with SDK 54, `expo-router`, TypeScript, ESLint/Prettier.
- Configure `babel-plugin-module-resolver` alias `@ -> ./src`.
- Theme: light, clean typography; base spacing; icons via `@expo/vector-icons`.
- Global layout `app/_layout.tsx` with bottom tabs (Feed, Campaigns, Reminders) and Fuel stack.
- Conditional entry: if any subscription exists → `feed`, else → `choose`.

## Phase 2 — Data Modeling (Hardcoded)

- `src/data/campaigns.ts`: id, name, groupId, languages, shortDescription, code.
- `src/data/groups.ts`: group ids → names (Doxa Life, 110 Cities, Ramadan 2026).
- `src/data/fuel.ts`: per campaign/day JSON blocks (heading, paragraph, list, image, action).
- `src/data/languages.ts`: language codes and labels.
- Provide 6–10 example campaigns and 7–14 days of sample fuel across 2–3 campaigns.

## Phase 3 — State & Business Logic (No IO)

- `src/state/store.ts` (Zustand):
- `subscribedCampaignIds: string[]`
- `reminders: { id, time: string, days: string[], campaignId?: string }[]`
- `prayed: Record<string /* fuelId */, boolean>`
- `preferences: { languageByCampaign: Record<string, string> }`
- Actions: subscribe/unsubscribe, setLanguage, add/update/deleteReminder, markPrayed.
- Optional hydration with `AsyncStorage` (prototype-only persistence).

## Phase 4 — Navigation & Entry Flow

- Tabs: Feed (`/feed`), Campaigns (`/campaigns`), Reminders (`/reminders`).
- Stack: Fuel detail (`/fuel/[id]`).
- Initial route logic in `app/index.tsx` using store state.

## Phase 5 — Campaign Chooser (Search/Filter/Code)

- Screen `app/choose.tsx`:
- `SearchBar` with debounced filter by name.
- `FilterChips` for language and group.
- Code input to filter by `campaign.code`.
- Grouped list with section headers; live count of visible items.
- Tap campaign → subscribe and navigate to Feed.
- Data: `src/data/campaigns.ts`, `groups.ts`, `languages.ts`.

## Phase 6 — Prayer Feed (Aggregated List)

- Screen `app/feed.tsx`:
- Top: reminder schedule summary + button to edit (to Reminders).
- List of day items across subscribed campaigns (today ±6 days), grouped by date.
- Each item: campaign name, short description, button → Fuel; prayed items show ✓ and subdued style.

## Phase 7 — Prayer Fuel (JSON Renderer)

- Screen `app/fuel/[id].tsx`:
- Render from `src/data/fuel.ts` using `JsonContentRenderer`: Heading, Paragraph, BulletList, Image, Button.
- Language switcher (uses `preferences.languageByCampaign`).
- Share button (UI only; `Share.share` with static text via `share.ts`).
- `I prayed` toggles prayed state and returns; if already prayed, show `✓ Prayed`.

## Phase 8 — Campaigns (Manage Subscriptions)

- Screen `app/campaigns.tsx`:
- List subscribed campaigns; per-item kebab: Unsubscribe, Change Language, Share.
- Button to find new campaign → `choose`.

## Phase 9 — Reminders (UI-Only Scheduling)

- Screen `app/reminders.tsx` with `ReminderEditor`:
- Add/edit/delete reminders: time input, weekday toggles, optional per-campaign targeting.
- Visual overlap validation only; no OS scheduling.
- Persist in store; show summary in Feed.

## Phase 10 — Polish & QoL

- Basic i18n scaffold in `i18n.ts` for labels (EN-only acceptable).
- Accessibility: touch targets, roles, dynamic font sizes.
- Empty states (no network loaders needed).
- Theming tokens for colors/spacing; optional dark mode.

## Phase 11 — Non-Goals (Explicit)

- No HTTP requests or live data; no notification permissions or scheduling.
- No analytics, auth, or deep linking.
- No app store builds.

## Acceptance Criteria by Screen

- Choose: search, language/group filters, code filter, live count; tap subscribes and navigates.
- Feed: reminders summary; aggregated day items; prayed items display ✓.
- Fuel: renders JSON blocks; language toggle switches variant; `I prayed` toggles and returns.
- Campaigns: lists subscriptions; kebab actions work; navigate to Choose.
- Reminders: can create/edit/delete reminders; reflected in Feed summary.

## Key Files to Implement

- `app/_layout.tsx`, `app/index.tsx`, `app/choose.tsx`, `app/feed.tsx`, `app/fuel/[id].tsx`, `app/campaigns.tsx`, `app/reminders.tsx`
- `src/components/ReminderEditor.tsx`, `src/components/JsonContentRenderer.tsx`, `src/components/SearchBar.tsx`, `src/components/FilterChips.tsx`, `src/components/KebabMenu.tsx`
- `src/state/store.ts`
- `src/data/*.ts`

## Compatibility Notes (SDK 54)

- Use Expo-managed versions; avoid pinning React Native directly.
- Avoid installing `@react-navigation/*` alongside expo-router to prevent version conflicts.
- Community libs listed are compatible with SDK 54 ranges above.
- Ensure Node 18+ and latest Expo CLI are used.