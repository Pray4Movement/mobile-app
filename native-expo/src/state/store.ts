import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Reminder {
  id: string;
  time: string; // HH:mm format
  days: string[]; // ['monday', 'tuesday', ...]
  campaignId?: string; // optional: specific campaign or all campaigns
}

interface Preferences {
  languageByCampaign: Record<string, string>; // campaignId -> language code
}

interface AppState {
  subscribedCampaignIds: string[];
  reminders: Reminder[];
  prayed: Record<string, boolean>; // fuelId -> boolean
  preferences: Preferences;

  // Actions
  subscribe: (campaignId: string) => void;
  unsubscribe: (campaignId: string) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  setLanguage: (campaignId: string, languageCode: string) => void;
  markPrayed: (fuelId: string) => void;
  unmarkPrayed: (fuelId: string) => void;
  loadState: () => Promise<void>;
  saveState: () => Promise<void>;
}

const STORAGE_KEY = '@doxa_app_state';

const defaultState = {
  subscribedCampaignIds: [],
  reminders: [],
  prayed: {},
  preferences: {
    languageByCampaign: {},
  },
};

export const useAppStore = create<AppState>((set, get) => ({
  ...defaultState,

  subscribe: (campaignId: string) => {
    set((state) => {
      if (state.subscribedCampaignIds.includes(campaignId)) {
        return state;
      }
      return {
        subscribedCampaignIds: [...state.subscribedCampaignIds, campaignId],
      };
    });
    get().saveState();
  },

  unsubscribe: (campaignId: string) => {
    set((state) => ({
      subscribedCampaignIds: state.subscribedCampaignIds.filter(id => id !== campaignId),
      preferences: {
        ...state.preferences,
        languageByCampaign: Object.fromEntries(
          Object.entries(state.preferences.languageByCampaign).filter(([id]) => id !== campaignId)
        ),
      },
    }));
    get().saveState();
  },

  addReminder: (reminder: Reminder) => {
    set((state) => ({
      reminders: [...state.reminders, reminder],
    }));
    get().saveState();
  },

  updateReminder: (id: string, reminder: Partial<Reminder>) => {
    set((state) => ({
      reminders: state.reminders.map(r =>
        r.id === id ? { ...r, ...reminder } : r
      ),
    }));
    get().saveState();
  },

  deleteReminder: (id: string) => {
    set((state) => ({
      reminders: state.reminders.filter(r => r.id !== id),
    }));
    get().saveState();
  },

  setLanguage: (campaignId: string, languageCode: string) => {
    set((state) => ({
      preferences: {
        ...state.preferences,
        languageByCampaign: {
          ...state.preferences.languageByCampaign,
          [campaignId]: languageCode,
        },
      },
    }));
    get().saveState();
  },

  markPrayed: (fuelId: string) => {
    set((state) => ({
      prayed: { ...state.prayed, [fuelId]: true },
    }));
    get().saveState();
  },

  unmarkPrayed: (fuelId: string) => {
    set((state) => {
      const { [fuelId]: _, ...rest } = state.prayed;
      return { prayed: rest };
    });
    get().saveState();
  },

  loadState: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          subscribedCampaignIds: parsed.subscribedCampaignIds || defaultState.subscribedCampaignIds,
          reminders: parsed.reminders || defaultState.reminders,
          prayed: parsed.prayed || defaultState.prayed,
          preferences: parsed.preferences || defaultState.preferences,
        });
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  },

  saveState: async () => {
    try {
      const state = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        subscribedCampaignIds: state.subscribedCampaignIds,
        reminders: state.reminders,
        prayed: state.prayed,
        preferences: state.preferences,
      }));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  },
}));

