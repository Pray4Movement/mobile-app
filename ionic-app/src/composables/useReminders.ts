import { ref, computed } from 'vue';
import {
  ensureLocalNotificationPermissions,
  scheduleReminderNotifications,
  cancelReminderNotifications,
  rescheduleAllReminderNotifications,
  getLocalNotificationPermissionStatus,
  type NotificationPermissionResult,
  type NotificationPermissionState,
} from '../utils/localNotifications';

export interface Reminder {
  id: string;
  label: string;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  times: string[]; // HH:mm format
}

const STORAGE_KEY = 'prayer_app_reminders';

const reminders = ref<Reminder[]>(loadReminders());
const notificationPermission = ref<NotificationPermissionState>('prompt');
let notificationsInitialized = false;

function loadReminders(): Reminder[] {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveReminders() {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders.value));
  } catch (error) {
    console.error('Failed to save reminders:', error);
  }
}

function generateId(): string {
  return `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function initializeNotifications() {
  if (notificationsInitialized) {
    return;
  }

  notificationsInitialized = true;

  try {
    const status = await getLocalNotificationPermissionStatus();
    notificationPermission.value = status;

    if (status === 'granted') {
      await rescheduleAllReminderNotifications(reminders.value);
    }
  } catch (error) {
    console.warn('Failed to initialize local notifications', error);
  }
}

if (typeof window !== 'undefined') {
  void initializeNotifications();
} else {
  notificationsInitialized = true;
}

export function useReminders() {
  const notificationsSupported = computed(
    () => notificationPermission.value !== 'unsupported',
  );
  const notificationPermissionStatus = computed(() => notificationPermission.value);

  const addReminder = (reminder: Omit<Reminder, 'id'>): Reminder => {
    const newReminder: Reminder = {
      ...reminder,
      id: generateId(),
    };
    reminders.value.push(newReminder);
    saveReminders();

    if (notificationPermission.value === 'granted') {
      void scheduleReminderNotifications(newReminder).catch(error => {
        console.error('Failed to schedule reminder notifications', error);
      });
    }

    return newReminder;
  };

  const updateReminder = (id: string, updates: Partial<Omit<Reminder, 'id'>>) => {
    const index = reminders.value.findIndex(r => r.id === id);
    if (index === -1) {
      return;
    }

    const existing = reminders.value[index];
    const previousReminder: Reminder = {
      ...existing,
      daysOfWeek: [...existing.daysOfWeek],
      times: [...existing.times],
    };

    const updatedReminder: Reminder = { ...existing, ...updates };
    reminders.value[index] = updatedReminder;
    saveReminders();

    if (notificationPermission.value === 'granted') {
      void (async () => {
        try {
          await cancelReminderNotifications(previousReminder);
          await scheduleReminderNotifications(updatedReminder);
        } catch (error) {
          console.error('Failed to update reminder notifications', error);
        }
      })();
    }
  };

  const removeReminder = (id: string) => {
    const target = reminders.value.find(r => r.id === id);
    if (!target) {
      return;
    }

    const reminderToCancel: Reminder = {
      ...target,
      daysOfWeek: [...target.daysOfWeek],
      times: [...target.times],
    };

    reminders.value = reminders.value.filter(r => r.id !== id);
    saveReminders();

    if (notificationPermission.value === 'granted') {
      void cancelReminderNotifications(reminderToCancel).catch(error => {
        console.error('Failed to cancel reminder notifications', error);
      });
    }
  };

  const getReminder = (id: string): Reminder | undefined => {
    return reminders.value.find(r => r.id === id);
  };

  const requestNotificationPermission = async (): Promise<NotificationPermissionResult> => {
    const result = await ensureLocalNotificationPermissions();
    notificationPermission.value = result.status;

    if (result.granted) {
      try {
        await rescheduleAllReminderNotifications(reminders.value);
      } catch (error) {
        console.error('Failed to sync reminders after enabling notifications', error);
      }
    }

    return result;
  };

  const syncReminderNotifications = async (): Promise<boolean> => {
    if (!notificationsSupported.value) {
      return false;
    }

    if (notificationPermission.value !== 'granted') {
      try {
        notificationPermission.value = await getLocalNotificationPermissionStatus();
      } catch (error) {
        console.warn('Failed to refresh notification permission status', error);
        return false;
      }
    }

    if (notificationPermission.value !== 'granted') {
      return false;
    }

    try {
      await rescheduleAllReminderNotifications(reminders.value);
      return true;
    } catch (error) {
      console.error('Failed to reschedule reminder notifications', error);
      return false;
    }
  };

  return {
    reminders: computed(() => reminders.value),
    addReminder,
    updateReminder,
    removeReminder,
    getReminder,
    requestNotificationPermission,
    notificationsSupported,
    notificationPermissionStatus,
    syncReminderNotifications,
  };
}

