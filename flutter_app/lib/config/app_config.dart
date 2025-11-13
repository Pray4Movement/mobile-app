import 'package:flutter/material.dart';

abstract class AppConfig {
  static AppConfig? _current;

  static AppConfig get current {
    if (_current == null) {
      throw Exception('AppConfig not initialized. Call AppConfig.initialize() first.');
    }
    return _current!;
  }

  static void initialize(AppConfig config) {
    _current = config;
  }

  // App variant identifier
  String get appVariant;

  // App metadata
  String get appName;
  String get androidApplicationId;
  String get iosBundleId;

  // Campaign filtering
  String? get campaignGroupFilter;

  // Branding theme
  ThemeData get brandingTheme;
}

