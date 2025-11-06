import 'package:flutter_local_notifications/flutter_local_notifications.dart';

// Top-level function for handling background notifications
// This must be a top-level function, not a class method
@pragma('vm:entry-point')
void notificationTapBackground(NotificationResponse response) {
  // This is called when a notification is tapped while the app is in the background
  // The main app will handle navigation when it comes to foreground
  // We can't do much here since the app isn't fully initialized
}

