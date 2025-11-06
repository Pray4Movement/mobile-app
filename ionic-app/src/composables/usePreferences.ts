import { ref, computed } from 'vue';

const STORAGE_KEY = 'prayer_app_preferences';

interface Preferences {
  appLanguage: string;
  campaignLanguages: Record<string, string>; // campaignId -> language
}

const defaultPreferences: Preferences = {
  appLanguage: 'en',
  campaignLanguages: {},
};

const preferences = ref<Preferences>(loadPreferences());

function loadPreferences(): Preferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { ...defaultPreferences };
  } catch {
    return { ...defaultPreferences };
  }
}

function savePreferences() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences.value));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

export function usePreferences() {
  const setAppLanguage = (language: string) => {
    preferences.value.appLanguage = language;
    savePreferences();
  };

  const setCampaignLanguage = (campaignId: string, language: string) => {
    preferences.value.campaignLanguages[campaignId] = language;
    savePreferences();
  };

  const getCampaignLanguage = (campaignId: string): string => {
    return preferences.value.campaignLanguages[campaignId] || 'en';
  };

  return {
    appLanguage: computed(() => preferences.value.appLanguage),
    campaignLanguages: computed(() => preferences.value.campaignLanguages),
    setAppLanguage,
    setCampaignLanguage,
    getCampaignLanguage,
  };
}

