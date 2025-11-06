import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryColor = Color(0xFF424242);
  static const Color secondaryColor = Color(0xFF757575);
  static const Color backgroundColor = Color(0xFFF5F5F5);
  static const Color surfaceColor = Colors.white;
  static const Color errorColor = Color(0xFF212121);

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: const ColorScheme.light(
        primary: Color(0xFF424242),
        onPrimary: Colors.white,
        secondary: Color(0xFF757575),
        onSecondary: Colors.white,
        error: Color(0xFF212121),
        onError: Colors.white,
        surface: Colors.white,
        onSurface: Color(0xFF212121),
        background: Color(0xFFF5F5F5),
        onBackground: Color(0xFF212121),
      ),
      scaffoldBackgroundColor: backgroundColor,
      appBarTheme: const AppBarTheme(
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardThemeData(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        filled: true,
        fillColor: surfaceColor,
      ),
    );
  }
}

