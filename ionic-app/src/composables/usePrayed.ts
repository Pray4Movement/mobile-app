import { ref } from 'vue';

const STORAGE_KEY = 'prayer_app_prayed';

interface PrayedItem {
  campaignId: string;
  dateISO: string;
}

const prayedItems = ref<Set<string>>(loadPrayedItems());

const KEY_SEPARATOR = '::';

function loadPrayedItems(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const items: PrayedItem[] = JSON.parse(stored);
      return new Set(items.map(item => `${item.campaignId}${KEY_SEPARATOR}${item.dateISO}`));
    }
    return new Set();
  } catch {
    return new Set();
  }
}

function savePrayedItems() {
  try {
    const items: PrayedItem[] = Array.from(prayedItems.value).map(key => {
      const [campaignId, dateISO] = key.split(KEY_SEPARATOR);
      return { campaignId, dateISO };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save prayed items:', error);
  }
}

export function usePrayed() {
  const markAsPrayed = (campaignId: string, dateISO: string) => {
    const key = `${campaignId}${KEY_SEPARATOR}${dateISO}`;
    prayedItems.value.add(key);
    savePrayedItems();
  };

  const unmarkAsPrayed = (campaignId: string, dateISO: string) => {
    const key = `${campaignId}${KEY_SEPARATOR}${dateISO}`;
    prayedItems.value.delete(key);
    savePrayedItems();
  };

  const isPrayed = (campaignId: string, dateISO: string): boolean => {
    const key = `${campaignId}${KEY_SEPARATOR}${dateISO}`;
    return prayedItems.value.has(key);
  };

  return {
    markAsPrayed,
    unmarkAsPrayed,
    isPrayed,
  };
}

