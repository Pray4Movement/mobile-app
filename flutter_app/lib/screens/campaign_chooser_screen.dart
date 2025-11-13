import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/campaign.dart';
import '../services/data_service.dart';
import '../services/state_service.dart';
import '../data/languages_data.dart';
import '../widgets/search_bar.dart';
import '../widgets/filter_chips.dart';
import '../widgets/campaign_card.dart';

class CampaignChooserScreen extends StatefulWidget {
  const CampaignChooserScreen({super.key});

  @override
  State<CampaignChooserScreen> createState() => _CampaignChooserScreenState();
}

class _CampaignChooserScreenState extends State<CampaignChooserScreen> {
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _codeController = TextEditingController();
  String? _selectedLanguage;
  String? _selectedGroupId;
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    _codeController.dispose();
    super.dispose();
  }

  List<Campaign> _getFilteredCampaigns() {
    var campaigns = DataService.getAvailableCampaigns();

    // Filter by search query
    if (_searchQuery.isNotEmpty) {
      campaigns = campaigns
          .where((c) =>
              c.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
              c.shortDescription.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }

    // Filter by campaign code
    if (_codeController.text.isNotEmpty) {
      final codeCampaign = DataService.getCampaignByCode(_codeController.text);
      if (codeCampaign != null) {
        campaigns = [codeCampaign];
      } else {
        campaigns = [];
      }
    }

    // Filter by language
    if (_selectedLanguage != null) {
      campaigns = campaigns
          .where((c) => c.languages.contains(_selectedLanguage))
          .toList();
    }

    // Filter by group
    if (_selectedGroupId != null) {
      campaigns =
          campaigns.where((c) => c.groupId == _selectedGroupId).toList();
    }

    return campaigns;
  }

  Map<String, List<Campaign>> _getGroupedCampaigns(List<Campaign> campaigns) {
    final Map<String, List<Campaign>> grouped = {};
    for (var campaign in campaigns) {
      if (!grouped.containsKey(campaign.groupId)) {
        grouped[campaign.groupId] = [];
      }
      grouped[campaign.groupId]!.add(campaign);
    }
    return grouped;
  }

  void _handleSubscribe(Campaign campaign) async {
    final appState = Provider.of<AppState>(context, listen: false);
    final wasFirstSubscription = appState.subscribedCampaignIds.isEmpty;
    await appState.subscribe(campaign.id);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Subscribed to ${campaign.name}'),
          duration: const Duration(seconds: 2),
        ),
      );

      // If this was the first subscription, navigate to prayer feed
      if (wasFirstSubscription) {
        Navigator.pushReplacementNamed(context, '/prayer-feed');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final filteredCampaigns = _getFilteredCampaigns();
    final groupedCampaigns = _getGroupedCampaigns(filteredCampaigns);
    final groups = DataService.getAvailableGroups();
    final languageCodes = getAllLanguageCodes();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Choose a Campaign'),
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: SearchBarWidget(
              controller: _searchController,
              hintText: 'Search campaigns...',
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),
          // Campaign code input
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: TextField(
              controller: _codeController,
              decoration: const InputDecoration(
                labelText: 'Campaign Code (optional)',
                hintText: 'Enter campaign code',
                prefixIcon: Icon(Icons.code),
              ),
              onChanged: (value) {
                setState(() {});
              },
            ),
          ),
          const SizedBox(height: 8),
          // Group filter buttons
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: FilterChip(
                      label: const Text('All Groups'),
                      selected: _selectedGroupId == null,
                      onSelected: (selected) {
                        setState(() {
                          _selectedGroupId = null;
                        });
                      },
                    ),
                  ),
                  ...groups.map((group) {
                    return Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: FilterChip(
                        label: Text(group.name),
                        selected: _selectedGroupId == group.id,
                        onSelected: (selected) {
                          setState(() {
                            _selectedGroupId = selected ? group.id : null;
                          });
                        },
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          // Language filter
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: FilterChips(
              options: languageCodes.map((code) => getLanguageName(code)).toList(),
              selected: _selectedLanguage != null
                  ? getLanguageName(_selectedLanguage!)
                  : null,
              onSelected: (selected) {
                setState(() {
                  _selectedLanguage = selected != null
                      ? languageCodes.firstWhere(
                          (code) => getLanguageName(code) == selected)
                      : null;
                });
              },
            ),
          ),
          // Campaign count
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              '${filteredCampaigns.length} campaign${filteredCampaigns.length != 1 ? 's' : ''} found',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                  ),
            ),
          ),
          // Campaign list
          Expanded(
            child: filteredCampaigns.isEmpty
                ? Center(
                    child: Text(
                      'No campaigns found',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Theme.of(context)
                                .colorScheme
                                .onSurface
                                .withOpacity(0.5),
                          ),
                    ),
                  )
                : ListView.builder(
                    itemCount: groupedCampaigns.length,
                    itemBuilder: (context, index) {
                      final groupId = groupedCampaigns.keys.elementAt(index);
                      final group = DataService.getGroupById(groupId);
                      final campaigns = groupedCampaigns[groupId]!;

                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (groupedCampaigns.length > 1)
                            Padding(
                              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                              child: Text(
                                group?.name ?? 'Other',
                                style: Theme.of(context)
                                    .textTheme
                                    .titleMedium
                                    ?.copyWith(
                                      fontWeight: FontWeight.bold,
                                    ),
                              ),
                            ),
                          ...campaigns.map((campaign) {
                            return CampaignCard(
                              campaign: campaign,
                              isSubscribed:
                                  appState.isSubscribed(campaign.id),
                              onSubscribe: () => _handleSubscribe(campaign),
                            );
                          }),
                        ],
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

