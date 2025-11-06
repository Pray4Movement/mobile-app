import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme.dart';
import 'services/state_service.dart';
import 'services/notification_service.dart';
import 'screens/campaign_chooser_screen.dart';
import 'screens/prayer_feed_screen.dart';
import 'screens/prayer_fuel_screen.dart';
import 'screens/campaigns_screen.dart';

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
    _notificationService.onNotificationTapped = (campaignId) {
      // Navigate to prayer feed when notification is tapped
      // If campaignId is provided, we could filter to that campaign
      // For now, just navigate to prayer feed
      navigatorKey.currentState?.pushNamedAndRemoveUntil(
        '/prayer-feed',
        (route) => false,
      );
    };

    // Set up foreground notification handler (for when app is open)
    _notificationService.onForegroundNotification = (response) {
      // Show a dialog or snackbar when notification arrives while app is in foreground
      // For now, we'll just navigate - the notification will still appear in the system tray
      if (response.payload != null) {
        navigatorKey.currentState?.pushNamedAndRemoveUntil(
          '/prayer-feed',
          (route) => false,
        );
      }
    };
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
            body: Center(
              child: CircularProgressIndicator(),
            ),
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
