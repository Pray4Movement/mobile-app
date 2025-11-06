import 'package:flutter/foundation.dart';
import '../models/reminder.dart';
import '../models/preferences.dart';
import 'storage_service.dart';
import 'notification_service.dart';

class AppState extends ChangeNotifier {
  List<String> _subscribedCampaignIds = [];
  List<Reminder> _reminders = [];
  Map<String, bool> _prayed = {}; // fuelId -> boolean
  AppPreferences _preferences = AppPreferences();
  bool _isLoading = true;

  List<String> get subscribedCampaignIds => _subscribedCampaignIds;
  List<Reminder> get reminders => _reminders;
  Map<String, bool> get prayed => _prayed;
  AppPreferences get preferences => _preferences;
  bool get isLoading => _isLoading;

  // Initialize and load state from storage
  Future<void> loadState() async {
    _isLoading = true;
    notifyListeners();

    try {
      _subscribedCampaignIds = await StorageService.loadSubscribedCampaigns();
      _reminders = await StorageService.loadReminders();
      _prayed = await StorageService.loadPrayedStatus();
      _preferences = await StorageService.loadPreferences();

      // Reschedule all reminders after loading
      await NotificationService().rescheduleAllReminders(_reminders);
    } catch (e) {
      debugPrint('Error loading state: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Subscribe to a campaign
  Future<void> subscribe(String campaignId) async {
    if (_subscribedCampaignIds.contains(campaignId)) return;
    _subscribedCampaignIds = [..._subscribedCampaignIds, campaignId];
    notifyListeners();
    await StorageService.saveSubscribedCampaigns(_subscribedCampaignIds);
  }

  // Unsubscribe from a campaign
  Future<void> unsubscribe(String campaignId) async {
    _subscribedCampaignIds = _subscribedCampaignIds.where((id) => id != campaignId).toList();
    // Remove language preference for this campaign
    final updatedLanguageByCampaign = Map<String, String>.from(_preferences.languageByCampaign);
    updatedLanguageByCampaign.remove(campaignId);
    _preferences = AppPreferences(languageByCampaign: updatedLanguageByCampaign);
    notifyListeners();
    await StorageService.saveSubscribedCampaigns(_subscribedCampaignIds);
    await StorageService.savePreferences(_preferences);
  }

  // Add a reminder
  Future<void> addReminder(Reminder reminder) async {
    _reminders = [..._reminders, reminder];
    notifyListeners();
    await StorageService.saveReminders(_reminders);
    // Schedule notification for the new reminder
    await NotificationService().scheduleReminder(reminder);
  }

  // Update a reminder
  Future<void> updateReminder(String id, Reminder reminder) async {
    try {
      // Find the old reminder to cancel its notifications
      final oldReminder = _reminders.firstWhere((r) => r.id == id);
      await NotificationService().cancelReminder(oldReminder);
    } catch (e) {
      debugPrint('Error canceling old reminder: $e');
    }

    _reminders = _reminders.map((r) => r.id == id ? reminder : r).toList();
    notifyListeners();
    await StorageService.saveReminders(_reminders);
    // Schedule notification for the updated reminder
    await NotificationService().scheduleReminder(reminder);
  }

  // Delete a reminder
  Future<void> deleteReminder(String id) async {
    try {
      // Find the reminder to cancel its notifications
      final reminder = _reminders.firstWhere((r) => r.id == id);
      await NotificationService().cancelReminder(reminder);
    } catch (e) {
      debugPrint('Error canceling reminder: $e');
    }

    _reminders = _reminders.where((r) => r.id != id).toList();
    notifyListeners();
    await StorageService.saveReminders(_reminders);
  }

  // Mark fuel as prayed
  Future<void> markPrayed(String fuelId) async {
    _prayed = {..._prayed, fuelId: true};
    notifyListeners();
    await StorageService.savePrayedStatus(_prayed);
  }

  // Unmark fuel as prayed
  Future<void> unmarkPrayed(String fuelId) async {
    final updated = Map<String, bool>.from(_prayed);
    updated.remove(fuelId);
    _prayed = updated;
    notifyListeners();
    await StorageService.savePrayedStatus(_prayed);
  }

  // Set language for a campaign
  Future<void> setLanguage(String campaignId, String languageCode) async {
    final updatedLanguageByCampaign = Map<String, String>.from(_preferences.languageByCampaign);
    updatedLanguageByCampaign[campaignId] = languageCode;
    _preferences = AppPreferences(languageByCampaign: updatedLanguageByCampaign);
    notifyListeners();
    await StorageService.savePreferences(_preferences);
  }

  // Get language for a campaign (defaults to 'en')
  String getLanguageForCampaign(String campaignId) {
    return _preferences.languageByCampaign[campaignId] ?? 'en';
  }

  // Check if fuel is prayed
  bool isPrayed(String fuelId) {
    return _prayed[fuelId] ?? false;
  }

  // Check if campaign is subscribed
  bool isSubscribed(String campaignId) {
    return _subscribedCampaignIds.contains(campaignId);
  }
}

