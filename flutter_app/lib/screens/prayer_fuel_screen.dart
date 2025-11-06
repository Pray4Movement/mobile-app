import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/fuel.dart';
import '../services/data_service.dart';
import '../services/state_service.dart';
import '../data/languages_data.dart';
import '../widgets/json_content_renderer.dart';
import '../utils/share_utils.dart';

class PrayerFuelScreen extends StatefulWidget {
  final String campaignId;
  final int day;

  const PrayerFuelScreen({
    super.key,
    required this.campaignId,
    required this.day,
  });

  @override
  State<PrayerFuelScreen> createState() => _PrayerFuelScreenState();
}

class _PrayerFuelScreenState extends State<PrayerFuelScreen> {
  String? _selectedLanguage;

  @override
  void initState() {
    super.initState();
    final appState = Provider.of<AppState>(context, listen: false);
    _selectedLanguage = appState.getLanguageForCampaign(widget.campaignId);
  }

  FuelContent? _getFuelContent() {
    final fuel = DataService.getFuelByCampaignAndDay(
      widget.campaignId,
      widget.day,
    );
    if (fuel == null) return null;

    final language = _selectedLanguage ?? 'en';
    if (fuel.languages.containsKey(language)) {
      return fuel.languages[language];
    }
    // Fallback to first available language
    return fuel.languages.values.first;
  }

  void _handleLanguageChange(String? languageCode) async {
    if (languageCode == null) return;

    setState(() {
      _selectedLanguage = languageCode;
    });

    final appState = Provider.of<AppState>(context, listen: false);
    await appState.setLanguage(widget.campaignId, languageCode);
  }

  void _handlePrayed() async {
    final fuel = DataService.getFuelByCampaignAndDay(
      widget.campaignId,
      widget.day,
    );
    if (fuel == null) return;

    final appState = Provider.of<AppState>(context, listen: false);
    await appState.markPrayed(fuel.id);

    if (mounted) {
      Navigator.of(context).pop();
    }
  }

  void _handleShare() {
    final campaign = DataService.getCampaignById(widget.campaignId);
    if (campaign != null) {
      ShareUtils.sharePrayerFuel(campaign.name, widget.day);
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final campaign = DataService.getCampaignById(widget.campaignId);
    final fuel = DataService.getFuelByCampaignAndDay(
      widget.campaignId,
      widget.day,
    );

    if (campaign == null || fuel == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Prayer Fuel'),
        ),
        body: const Center(
          child: Text('Prayer fuel not found'),
        ),
      );
    }

    final fuelContent = _getFuelContent();
    if (fuelContent == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Prayer Fuel'),
        ),
        body: const Center(
          child: Text('Content not available'),
        ),
      );
    }

    final isPrayed = appState.isPrayed(fuel.id);
    final availableLanguages = campaign.languages;

    return Scaffold(
      appBar: AppBar(
        title: Text('${campaign.name} - Day ${widget.day}'),
        actions: [
          // Language switcher
          if (availableLanguages.length > 1)
            PopupMenuButton<String>(
              icon: const Icon(Icons.language),
              onSelected: _handleLanguageChange,
              itemBuilder: (context) {
                return availableLanguages.map((langCode) {
                  return PopupMenuItem<String>(
                    value: langCode,
                    child: Row(
                      children: [
                        if (_selectedLanguage == langCode)
                          const Icon(Icons.check, size: 20),
                        if (_selectedLanguage == langCode)
                          const SizedBox(width: 8),
                        Text(getLanguageName(langCode)),
                      ],
                    ),
                  );
                }).toList();
              },
            ),
          // Share button
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: _handleShare,
            tooltip: 'Share',
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: JsonContentRenderer(blocks: fuelContent.blocks),
            ),
          ),
          // I prayed button
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  blurRadius: 4,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: isPrayed ? null : _handlePrayed,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (isPrayed) ...[
                      const Icon(Icons.check_circle),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      isPrayed ? 'Prayed' : 'I prayed',
                      style: const TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

