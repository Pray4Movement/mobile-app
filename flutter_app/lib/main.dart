import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme.dart';
import 'services/state_service.dart';
import 'services/notification_service.dart';
import 'services/data_service.dart';
import 'models/fuel.dart';
import 'screens/campaign_chooser_screen.dart';
import 'screens/prayer_feed_screen.dart';
import 'screens/prayer_fuel_screen.dart';
import 'screens/campaigns_screen.dart';
import 'utils/date_utils.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize notification service
  await NotificationService().initialize();

  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> with WidgetsBindingObserver {
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
  final NotificationService _notificationService = NotificationService();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _setupNotifications();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  void _setupNotifications() {
    // Set up notification tap handler (for when app is in background/terminated)
    _notificationService.onNotificationTapped = (payload) {
      _handleNotificationNavigation(payload);
    };

    // Set up foreground notification handler (for when app is open)
    _notificationService.onForegroundNotification = (response) {
      final payload = NotificationTapPayload.fromRaw(response.payload);
      _handleNotificationNavigation(payload);
    };
  }

  void _handleNotificationNavigation(NotificationTapPayload payload) {
    if (payload.campaignId == null) {
      _navigateToPrayerFeed();
      return;
    }

    final campaignId = payload.campaignId!;
    final targetDateString = _getDateStringForPayload(payload);
    final todaysFuel = DataService.getFuelByDate(targetDateString);

    Fuel? matchingFuel;
    for (final fuel in todaysFuel) {
      if (fuel.campaignId == campaignId) {
        matchingFuel = fuel;
        break;
      }
    }

    if (matchingFuel != null) {
      navigatorKey.currentState?.pushNamedAndRemoveUntil(
        '/prayer-fuel',
        (route) => false,
        arguments: {'campaignId': campaignId, 'day': matchingFuel.day},
      );
      return;
    }

    _navigateToPrayerFeed();
  }

  String _getDateStringForPayload(NotificationTapPayload payload) {
    final reminderDay = payload.reminderDay;
    if (reminderDay == null || reminderDay.isEmpty) {
      return getDateString(0);
    }

    final targetWeekday = _weekdayFromString(reminderDay);
    if (targetWeekday == null) {
      return getDateString(0);
    }

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final diff = (today.weekday - targetWeekday) % 7;
    final targetDate = today.subtract(Duration(days: diff));
    return getDateStringFromDate(targetDate);
  }

  int? _weekdayFromString(String day) {
    switch (day.toLowerCase()) {
      case 'monday':
        return DateTime.monday;
      case 'tuesday':
        return DateTime.tuesday;
      case 'wednesday':
        return DateTime.wednesday;
      case 'thursday':
        return DateTime.thursday;
      case 'friday':
        return DateTime.friday;
      case 'saturday':
        return DateTime.saturday;
      case 'sunday':
        return DateTime.sunday;
      default:
        return null;
    }
  }

  void _navigateToPrayerFeed() {
    navigatorKey.currentState?.pushNamedAndRemoveUntil(
      '/prayer-feed',
      (route) => false,
    );
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    // Handle app lifecycle changes if needed
    // For example, reschedule notifications when app comes to foreground
    if (state == AppLifecycleState.resumed) {
      // App came to foreground - could refresh notification schedules here
    }
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState()..loadState(),
      child: MaterialApp(
        navigatorKey: navigatorKey,
        title: 'Prayer App',
        theme: AppTheme.lightTheme,
        debugShowCheckedModeBanner: false,
        home: const InitialRoute(),
        routes: {
          '/campaign-chooser': (context) => const CampaignChooserScreen(),
          '/prayer-feed': (context) => const PrayerFeedScreen(),
          '/campaigns': (context) => const CampaignsScreen(),
        },
        onGenerateRoute: (settings) {
          if (settings.name == '/prayer-fuel') {
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (context) => PrayerFuelScreen(
                campaignId: args['campaignId'] as String,
                day: args['day'] as int,
              ),
            );
          }
          return null;
        },
      ),
    );
  }
}

class InitialRoute extends StatelessWidget {
  const InitialRoute({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        if (appState.isLoading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        // If user has subscriptions, go to prayer feed
        // Otherwise, go to campaign chooser
        if (appState.subscribedCampaignIds.isNotEmpty) {
          return const PrayerFeedScreen();
        } else {
          return const CampaignChooserScreen();
        }
      },
    );
  }
}
