import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/reminder.dart';
import '../models/preferences.dart';

class StorageService {
  static const String _keySubscribedCampaigns = 'subscribed_campaigns';
  static const String _keyReminders = 'reminders';
  static const String _keyPrayed = 'prayed';
  static const String _keyPreferences = 'preferences';

  // Subscribed Campaigns
  static Future<void> saveSubscribedCampaigns(List<String> campaignIds) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList(_keySubscribedCampaigns, campaignIds);
  }

  static Future<List<String>> loadSubscribedCampaigns() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_keySubscribedCampaigns) ?? [];
  }

  // Reminders
  static Future<void> saveReminders(List<Reminder> reminders) async {
    final prefs = await SharedPreferences.getInstance();
    final remindersJson = reminders.map((r) => r.toJson()).toList();
    await prefs.setString(_keyReminders, jsonEncode(remindersJson));
  }

  static Future<List<Reminder>> loadReminders() async {
    final prefs = await SharedPreferences.getInstance();
    final remindersJson = prefs.getString(_keyReminders);
    if (remindersJson == null) return [];
    try {
      final List<dynamic> decoded = jsonDecode(remindersJson);
      return decoded.map((r) => Reminder.fromJson(r as Map<String, dynamic>)).toList();
    } catch (e) {
      return [];
    }
  }

  // Prayed Status
  static Future<void> savePrayedStatus(Map<String, bool> prayed) async {
    final prefs = await SharedPreferences.getInstance();
    final prayedJson = jsonEncode(prayed);
    await prefs.setString(_keyPrayed, prayedJson);
  }

  static Future<Map<String, bool>> loadPrayedStatus() async {
    final prefs = await SharedPreferences.getInstance();
    final prayedJson = prefs.getString(_keyPrayed);
    if (prayedJson == null) return {};
    try {
      final Map<String, dynamic> decoded = jsonDecode(prayedJson);
      return decoded.map((key, value) => MapEntry(key, value as bool));
    } catch (e) {
      return {};
    }
  }

  // Preferences
  static Future<void> savePreferences(AppPreferences preferences) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyPreferences, jsonEncode(preferences.toJson()));
  }

  static Future<AppPreferences> loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    final preferencesJson = prefs.getString(_keyPreferences);
    if (preferencesJson == null) return AppPreferences();
    try {
      final Map<String, dynamic> decoded = jsonDecode(preferencesJson);
      return AppPreferences.fromJson(decoded);
    } catch (e) {
      return AppPreferences();
    }
  }
}

