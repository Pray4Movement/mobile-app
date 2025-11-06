import { Reminder } from './Reminder';

export interface UserState {
  subscribedCampaigns: string[]; // Array of campaign IDs
  prayedItems: string[]; // Array of fuel IDs that have been prayed
  campaignLanguages: Record<string, string>; // Map of campaignId to language code
  reminders: Reminder[];
  appLanguage: string; // Global app language
}

