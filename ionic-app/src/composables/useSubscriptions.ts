import { ref, computed } from 'vue';

export interface Subscription {
  campaignId: string;
  language: string;
}

const STORAGE_KEY = 'prayer_app_subscriptions';

const subscriptions = ref<Subscription[]>(loadSubscriptions());

function loadSubscriptions(): Subscription[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveSubscriptions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions.value));
  } catch (error) {
    console.error('Failed to save subscriptions:', error);
  }
}

export function useSubscriptions() {
  const subscribe = (campaignId: string, language: string = 'en') => {
    if (!subscriptions.value.find(s => s.campaignId === campaignId)) {
      subscriptions.value.push({ campaignId, language });
      saveSubscriptions();
    }
  };

  const unsubscribe = (campaignId: string) => {
    subscriptions.value = subscriptions.value.filter(s => s.campaignId !== campaignId);
    saveSubscriptions();
  };

  const isSubscribed = (campaignId: string): boolean => {
    return subscriptions.value.some(s => s.campaignId === campaignId);
  };

  const getSubscription = (campaignId: string): Subscription | undefined => {
    return subscriptions.value.find(s => s.campaignId === campaignId);
  };

  const updateLanguage = (campaignId: string, language: string) => {
    const sub = subscriptions.value.find(s => s.campaignId === campaignId);
    if (sub) {
      sub.language = language;
      saveSubscriptions();
    }
  };

  return {
    subscriptions: computed(() => subscriptions.value),
    subscribe,
    unsubscribe,
    isSubscribed,
    getSubscription,
    updateLanguage,
  };
}

