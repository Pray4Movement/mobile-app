import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme.dart';
import 'services/state_service.dart';
import 'screens/campaign_chooser_screen.dart';
import 'screens/prayer_feed_screen.dart';
import 'screens/prayer_fuel_screen.dart';
import 'screens/campaigns_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AppState()..loadState(),
      child: MaterialApp(
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
