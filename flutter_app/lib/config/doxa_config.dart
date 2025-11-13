import 'package:flutter/material.dart';
import 'app_config.dart';
import '../branding/doxa/theme.dart' as doxa_theme;

class DoxaConfig extends AppConfig {
  @override
  String get appVariant => 'doxa';

  @override
  String get appName => 'Doxa Prayer';

  @override
  String get androidApplicationId => 'com.doxa.prayer';

  @override
  String get iosBundleId => 'com.doxa.prayer';

  @override
  String? get campaignGroupFilter => 'doxa-life';

  @override
  ThemeData get brandingTheme => doxa_theme.AppTheme.lightTheme;
}

