import 'dart:convert';

import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tz;
import 'package:flutter/foundation.dart';
import '../models/reminder.dart';
import '../services/data_service.dart';
import 'notification_service_background.dart';

class NotificationTapPayload {
  NotificationTapPayload({
    this.campaignId,
    this.reminderId,
    this.reminderDay,
    this.rawPayload,
  });

  final String? campaignId;
  final String? reminderId;
  final String? reminderDay;
  final String? rawPayload;

  bool get isAllCampaigns => campaignId == null;

  static NotificationTapPayload fromRaw(String? raw) {
    if (raw == null || raw.isEmpty) {
      return NotificationTapPayload(rawPayload: raw);
    }

    try {
      final decoded = jsonDecode(raw);
      if (decoded is Map<String, dynamic>) {
        final type = decoded['type'] as String?;
        if (type == 'campaign') {
          return NotificationTapPayload(
            campaignId: decoded['campaignId'] as String?,
            reminderId: decoded['reminderId'] as String?,
            reminderDay: (decoded['dayOfWeek'] as String?)?.toLowerCase(),
            rawPayload: raw,
          );
        }

        if (type == 'all') {
          return NotificationTapPayload(
            reminderId: decoded['reminderId'] as String?,
            reminderDay: (decoded['dayOfWeek'] as String?)?.toLowerCase(),
            rawPayload: raw,
          );
        }
      }
    } catch (_) {
      // Fall back to legacy payload handling
    }

    if (raw == 'all') {
      return NotificationTapPayload(rawPayload: raw);
    }

    return NotificationTapPayload(campaignId: raw, rawPayload: raw);
  }
}

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();
  bool _initialized = false;

  // Callback for when notification is tapped
  Function(NotificationTapPayload payload)? onNotificationTapped;

  // Callback for foreground notifications
  Function(NotificationResponse)? onForegroundNotification;

  Future<void> initialize() async {
    if (_initialized) return;

    // Initialize timezone
    tz.initializeTimeZones();
    // The local timezone is automatically set by initializeTimeZones()
    // We can use tz.local directly which represents the system's local timezone

    // Android initialization settings
    const androidSettings = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );

    // iOS initialization settings
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    // Initialization settings
    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    // Initialize the plugin
    // onDidReceiveNotificationResponse handles foreground notifications
    // onDidReceiveBackgroundNotificationResponse handles background notifications
    await _notifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
      onDidReceiveBackgroundNotificationResponse: notificationTapBackground,
    );

    // Check if app was launched from a notification
    final launchDetails = await _notifications
        .getNotificationAppLaunchDetails();
    if (launchDetails?.didNotificationLaunchApp ?? false) {
      final response = launchDetails!.notificationResponse;
      if (response != null) {
        _onNotificationTapped(response);
      }
    }

    // Request permissions (iOS)
    if (!kIsWeb) {
      await _requestPermissions();
    }

    _initialized = true;
  }

  Future<void> _requestPermissions() async {
    final androidPlugin = _notifications
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();
    await androidPlugin?.requestNotificationsPermission();

    // Request exact alarm permission for Android 12+
    // Note: This may not show a dialog - user may need to grant in system settings
    if (androidPlugin != null) {
      final canSchedule = await androidPlugin.canScheduleExactNotifications();
      debugPrint('Can schedule exact notifications: $canSchedule');

      if (canSchedule != true) {
        // Try to request permission (may open settings on some devices)
        final granted = await androidPlugin.requestExactAlarmsPermission();
        debugPrint('Exact alarm permission request result: $granted');

        // If still not granted, the user will need to manually enable it in settings
        if (granted != true) {
          debugPrint(
            'Exact alarm permission not granted. User may need to enable it in system settings.',
          );
        }
      }
    }

    final iosPlugin = _notifications
        .resolvePlatformSpecificImplementation<
          IOSFlutterLocalNotificationsPlugin
        >();
    await iosPlugin?.requestPermissions(alert: true, badge: true, sound: true);
  }

  // Check if exact alarm permission is granted
  Future<bool> hasExactAlarmPermission() async {
    final androidPlugin = _notifications
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();
    if (androidPlugin == null) return false;

    final canSchedule = await androidPlugin.canScheduleExactNotifications();
    return canSchedule == true;
  }

  // Request exact alarm permission (may open system settings)
  Future<bool> requestExactAlarmPermission() async {
    final androidPlugin = _notifications
        .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin
        >();
    if (androidPlugin == null) return false;

    final granted = await androidPlugin.requestExactAlarmsPermission();
    return granted == true;
  }

  void _onNotificationTapped(NotificationResponse response) {
    debugPrint(
      'Notification tapped: ${response.id}, payload: ${response.payload}',
    );

    // Call foreground notification callback if set
    if (onForegroundNotification != null) {
      onForegroundNotification!(response);
    }

    // Call the main notification tap handler
    if (onNotificationTapped != null) {
      final payload = NotificationTapPayload.fromRaw(response.payload);
      onNotificationTapped!(payload);
    }
  }

  // Show a notification immediately (for foreground notifications)
  Future<void> showNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
  }) async {
    if (!_initialized) {
      await initialize();
    }

    const androidDetails = AndroidNotificationDetails(
      'prayer_reminders',
      'Prayer Reminders',
      channelDescription: 'Notifications for prayer reminders',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    await _notifications.show(
      id,
      title,
      body,
      NotificationDetails(android: androidDetails, iOS: iosDetails),
      payload: payload,
    );
  }

  int _getNotificationId(String reminderId) {
    // Convert reminder ID to a unique integer for notification ID
    return reminderId.hashCode.abs();
  }

  int _getDayOfWeek(String day) {
    const days = {
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6,
      'sunday': 7,
    };
    return days[day.toLowerCase()] ?? 1;
  }

  Future<void> scheduleReminder(Reminder reminder) async {
    if (!_initialized) {
      await initialize();
    }

    final timeParts = reminder.time.split(':');
    if (timeParts.length != 2) return;

    final hour = int.tryParse(timeParts[0]);
    final minute = int.tryParse(timeParts[1]);
    if (hour == null || minute == null) return;

    final notificationId = _getNotificationId(reminder.id);
    final campaign = reminder.campaignId != null
        ? DataService.getCampaignById(reminder.campaignId!)
        : null;

    // Create notification details
    final title = campaign != null
        ? 'Prayer Reminder: ${campaign.name}'
        : 'Prayer Reminder';
    const body = 'Time to pray! Tap to view today\'s prayer content.';
    final payload = reminder.campaignId ?? 'all';

    // Android notification details
    // Note: On Android, notifications will show in foreground by default
    // The plugin handles this automatically when importance is set to high
    const androidDetails = AndroidNotificationDetails(
      'prayer_reminders',
      'Prayer Reminders',
      channelDescription: 'Notifications for prayer reminders',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
      enableVibration: true,
      playSound: true,
    );

    // iOS notification details
    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    final notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    // Schedule notification for each selected day
    for (final day in reminder.days) {
      final dayOfWeek = _getDayOfWeek(day);

      // Calculate next occurrence of this day at the specified time
      final now = tz.TZDateTime.now(tz.local);

      // Find the next occurrence of the target day
      // Dart's DateTime.weekday: Monday = 1, Sunday = 7
      int currentWeekday = now.weekday;
      int daysUntilTarget = (dayOfWeek - currentWeekday) % 7;

      // If today is the target day, check if the time has passed
      if (daysUntilTarget == 0) {
        // Check if the time for today has already passed
        final todayAtTime = tz.TZDateTime(
          tz.local,
          now.year,
          now.month,
          now.day,
          hour,
          minute,
        );
        if (todayAtTime.isBefore(now) || todayAtTime.isAtSameMomentAs(now)) {
          // Time has passed today, schedule for next week
          daysUntilTarget = 7;
        } else {
          // Time hasn't passed yet today, schedule for today
          daysUntilTarget = 0;
        }
      }

      // Calculate the scheduled date
      var scheduledDate = tz.TZDateTime(
        tz.local,
        now.year,
        now.month,
        now.day,
        hour,
        minute,
      ).add(Duration(days: daysUntilTarget));

      debugPrint('Scheduling notification for $day at ${reminder.time}');
      debugPrint('Current time: $now');
      debugPrint('Scheduled time: $scheduledDate');
      debugPrint('Days until target: $daysUntilTarget');

      // Schedule weekly repeating notification
      try {
        // For Android, check if we can use exact alarms
        final androidPlugin = _notifications
            .resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin
            >();

        AndroidScheduleMode scheduleMode =
            AndroidScheduleMode.exactAllowWhileIdle;

        if (androidPlugin != null) {
          final canScheduleExactAlarms = await androidPlugin
              .canScheduleExactNotifications();
          debugPrint('Can schedule exact alarms: $canScheduleExactAlarms');

          if (canScheduleExactAlarms != true) {
            // Try to request permission first
            debugPrint('Exact alarm permission not granted, requesting...');
            final requested = await androidPlugin
                .requestExactAlarmsPermission();
            debugPrint('Permission request result: $requested');

            // Check again after request
            final canScheduleAfterRequest = await androidPlugin
                .canScheduleExactNotifications();
            debugPrint(
              'Can schedule exact alarms after request: $canScheduleAfterRequest',
            );

            if (canScheduleAfterRequest != true) {
              // Fall back to inexact scheduling if exact is not available
              scheduleMode = AndroidScheduleMode.inexactAllowWhileIdle;
              debugPrint(
                'Falling back to inexact scheduling - exact alarm permission not available',
              );
              debugPrint(
                'User may need to grant "Alarms & reminders" permission in system settings',
              );
            }
          }
        }

        await _notifications.zonedSchedule(
          notificationId + dayOfWeek, // Unique ID per day
          title,
          body,
          scheduledDate,
          notificationDetails,
          androidScheduleMode: scheduleMode,
          uiLocalNotificationDateInterpretation:
              UILocalNotificationDateInterpretation.absoluteTime,
          matchDateTimeComponents: DateTimeComponents.dayOfWeekAndTime,
          payload: _buildReminderPayload(reminder, day),
        );
        debugPrint(
          'Notification scheduled successfully for $day at $scheduledDate',
        );

        // Verify the notification was scheduled (Android only)
        if (androidPlugin != null) {
          final pendingNotifications = await _notifications
              .pendingNotificationRequests();
          final scheduled = pendingNotifications.any(
            (n) => n.id == notificationId + dayOfWeek,
          );
          debugPrint(
            'Notification verification: $scheduled (ID: ${notificationId + dayOfWeek})',
          );
          if (scheduled) {
            final notification = pendingNotifications.firstWhere(
              (n) => n.id == notificationId + dayOfWeek,
            );
            debugPrint(
              'Scheduled notification details: ${notification.title} at scheduled time',
            );
          }
        }
      } catch (e) {
        debugPrint('Error scheduling notification: $e');
        debugPrint('Stack trace: ${StackTrace.current}');
      }
    }

    // List all pending notifications for debugging
    await listPendingNotifications();
  }

  Future<void> cancelReminder(Reminder reminder) async {
    if (!_initialized) return;

    final notificationId = _getNotificationId(reminder.id);

    // Cancel all notifications for this reminder (one per day)
    for (final day in reminder.days) {
      final dayOfWeek = _getDayOfWeek(day);
      await _notifications.cancel(notificationId + dayOfWeek);
    }
  }

  Future<void> cancelAllReminders() async {
    if (!_initialized) return;
    await _notifications.cancelAll();
  }

  Future<void> rescheduleAllReminders(List<Reminder> reminders) async {
    if (!_initialized) {
      await initialize();
    }

    // Cancel all existing notifications
    await cancelAllReminders();

    // Schedule all reminders
    for (final reminder in reminders) {
      await scheduleReminder(reminder);
    }
  }

  // Debug method to list all pending notifications
  Future<void> listPendingNotifications() async {
    if (!_initialized) return;

    final pending = await _notifications.pendingNotificationRequests();
    debugPrint('=== Pending Notifications (${pending.length}) ===');
    for (final notification in pending) {
      debugPrint(
        'ID: ${notification.id}, Title: ${notification.title}, Body: ${notification.body}',
      );
    }
    debugPrint('==========================================');
  }

  String _buildReminderPayload(Reminder reminder, String day) {
    final payload = <String, dynamic>{
      'type': reminder.campaignId != null ? 'campaign' : 'all',
      'reminderId': reminder.id,
      'dayOfWeek': day.toLowerCase(),
    };

    if (reminder.campaignId != null) {
      payload['campaignId'] = reminder.campaignId;
    }

    return jsonEncode(payload);
  }
}
