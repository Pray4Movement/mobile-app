import 'package:flutter/material.dart';
import 'config/app_config.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return AppConfig.current.brandingTheme;
  }
}
