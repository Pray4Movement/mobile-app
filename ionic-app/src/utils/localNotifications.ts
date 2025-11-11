import { Capacitor } from '@capacitor/core';
import {
  LocalNotifications,
  type LocalNotificationSchema,
} from '@capacitor/local-notifications';
import type { Reminder } from '../composables/useReminders';

export type NotificationPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export interface NotificationPermissionResult {
  granted: boolean;
  status: NotificationPermissionState;
}

const CHANNEL_ID = 'prayer-reminders';
const CHANNEL_NAME = 'Prayer Reminders';
let channelInitialized = false;

function isPluginAvailable(): boolean {
  return Capacitor.isPluginAvailable('LocalNotifications');
}

function isAndroid(): boolean {
  return Capacitor.getPlatform() === 'android';
}

function normalizeStatus(status: Record<string, unknown> | undefined): NotificationPermissionState {
  if (!status) {
    return 'prompt';
  }

  const value = (status.display ?? status.permission ?? status.state ?? status.notifications) as
    | string
    | undefined;

  if (!value) {
    return 'prompt';
  }

  if (value === 'prompt-with-rationale') {
    return 'prompt';
  }

  if (value === 'granted' || value === 'denied' || value === 'prompt') {
    return value;
  }

  return 'prompt';
}

async function ensureChannel(): Promise<void> {
  if (!isPluginAvailable() || !isAndroid() || channelInitialized) {
    return;
  }

  await LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: CHANNEL_NAME,
    description: 'Prayer reminder notifications',
    importance: Importance.HIGH,
    visibility: Visibility.PUBLIC,
    vibration: true,
    sound: 'default',
  });

  channelInitialized = true;
}

function toWeekday(day: number): number {
  const normalized = ((day % 7) + 7) % 7;
  return normalized + 1;
}

function generateNotificationId(reminderId: string, day: number, time: string): number {
  const input = `${reminderId}-${day}-${time}`;
  let hash = 0;

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  const id = Math.abs(hash);
  return id === 0 ? 1 : id;
}

function buildNotifications(reminder: Reminder): LocalNotificationSchema[] {
  const { id, label, daysOfWeek, times } = reminder;
  const notifications: LocalNotificationSchema[] = [];

  daysOfWeek.forEach(day => {
    times.forEach(time => {
      const [hour, minute] = time.split(':').map(Number);

      if (Number.isNaN(hour) || Number.isNaN(minute)) {
        return;
      }

      notifications.push({
        id: generateNotificationId(id, day, time),
        title: label,
        body: 'Take a moment to pray.',
        schedule: {
          repeats: true,
          allowWhileIdle: true,
          on: {
            weekday: toWeekday(day),
            hour,
            minute,
          },
        },
        channelId: isAndroid() ? CHANNEL_ID : undefined,
        extra: {
          reminderId: id,
          day,
          time,
        },
      });
    });
  });

  return notifications;
}

function getNotificationIds(reminder: Reminder): number[] {
  const ids: number[] = [];
  reminder.daysOfWeek.forEach(day => {
    reminder.times.forEach(time => {
      ids.push(generateNotificationId(reminder.id, day, time));
    });
  });
  return ids;
}

export async function getLocalNotificationPermissionStatus(): Promise<NotificationPermissionState> {
  if (!isPluginAvailable()) {
    return 'unsupported';
  }

  const status = await LocalNotifications.checkPermissions();
  return normalizeStatus(status);
}

export async function ensureLocalNotificationPermissions(): Promise<NotificationPermissionResult> {
  if (!isPluginAvailable()) {
    return { granted: false, status: 'unsupported' };
  }

  let status = await getLocalNotificationPermissionStatus();

  if (status !== 'granted') {
    const request = await LocalNotifications.requestPermissions();
    status = normalizeStatus(request);
  }

  const granted = status === 'granted';

  if (granted) {
    await ensureChannel();
  }

  return { granted, status };
}

export async function scheduleReminderNotifications(reminder: Reminder): Promise<void> {
  if (!isPluginAvailable()) {
    return;
  }

  const notifications = buildNotifications(reminder);

  if (notifications.length === 0) {
    return;
  }

  await ensureChannel();

  try {
    await LocalNotifications.cancel({
      notifications: notifications.map(notification => ({ id: notification.id })),
    });
  } catch (error) {
    console.warn('Failed to clear existing notifications before scheduling', error);
  }

  await LocalNotifications.schedule({ notifications });
}

export async function cancelReminderNotifications(reminder: Reminder): Promise<void> {
  if (!isPluginAvailable()) {
    return;
  }

  const ids = getNotificationIds(reminder);

  if (ids.length === 0) {
    return;
  }

  await LocalNotifications.cancel({
    notifications: ids.map(id => ({ id })),
  });
}

export async function rescheduleAllReminderNotifications(reminders: Reminder[]): Promise<void> {
  if (!isPluginAvailable()) {
    return;
  }

  const notifications = reminders.flatMap(reminder => buildNotifications(reminder));

  if (notifications.length === 0) {
    return;
  }

  await ensureChannel();

  try {
    await LocalNotifications.cancel({
      notifications: notifications.map(notification => ({ id: notification.id })),
    });
  } catch (error) {
    console.warn('Failed to clear existing notifications before rescheduling', error);
  }

  await LocalNotifications.schedule({ notifications });
}

