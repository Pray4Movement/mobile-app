import 'package:flutter/material.dart';
import 'app_config.dart';
import '../branding/general/theme.dart' as general_theme;

class GeneralConfig extends AppConfig {
  @override
  String get appVariant => 'general';

  @override
  String get appName => 'Prayer App';

  @override
  String get androidApplicationId => 'com.prayer.app';

  @override
  String get iosBundleId => 'com.prayer.app';

  @override
  String? get campaignGroupFilter => null;

  @override
  ThemeData get brandingTheme => general_theme.AppTheme.lightTheme;
}

