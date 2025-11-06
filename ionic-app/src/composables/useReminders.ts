import { ref, computed } from 'vue';

export interface Reminder {
  id: string;
  label: string;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  times: string[]; // HH:mm format
}

const STORAGE_KEY = 'prayer_app_reminders';

const reminders = ref<Reminder[]>(loadReminders());

function loadReminders(): Reminder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReminders() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders.value));
  } catch (error) {
    console.error('Failed to save reminders:', error);
  }
}

function generateId(): string {
  return `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useReminders() {
  const addReminder = (reminder: Omit<Reminder, 'id'>): Reminder => {
    const newReminder: Reminder = {
      ...reminder,
      id: generateId(),
    };
    reminders.value.push(newReminder);
    saveReminders();
    return newReminder;
  };

  const updateReminder = (id: string, updates: Partial<Omit<Reminder, 'id'>>) => {
    const index = reminders.value.findIndex(r => r.id === id);
    if (index !== -1) {
      reminders.value[index] = { ...reminders.value[index], ...updates };
      saveReminders();
    }
  };

  const removeReminder = (id: string) => {
    reminders.value = reminders.value.filter(r => r.id !== id);
    saveReminders();
  };

  const getReminder = (id: string): Reminder | undefined => {
    return reminders.value.find(r => r.id === id);
  };

  return {
    reminders: computed(() => reminders.value),
    addReminder,
    updateReminder,
    removeReminder,
    getReminder,
  };
}

