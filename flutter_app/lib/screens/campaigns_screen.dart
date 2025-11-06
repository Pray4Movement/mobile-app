import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/campaign.dart';
import '../services/data_service.dart';
import '../services/state_service.dart';
import '../data/languages_data.dart';
import '../widgets/kebab_menu.dart';
import '../utils/share_utils.dart';

class CampaignsScreen extends StatelessWidget {
  const CampaignsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final subscribedCampaignIds = appState.subscribedCampaignIds;

    if (subscribedCampaignIds.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('My Campaigns'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.campaign_outlined,
                size: 64,
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.3),
              ),
              const SizedBox(height: 16),
              Text(
                'No campaigns subscribed',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withOpacity(0.5),
                    ),
              ),
              const SizedBox(height: 8),
              Text(
                'Find and subscribe to campaigns to get started',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Theme.of(context)
                          .colorScheme
                          .onSurface
                          .withOpacity(0.5),
                    ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, '/campaign-chooser');
                },
                icon: const Icon(Icons.add),
                label: const Text('Find New Campaign'),
              ),
            ],
          ),
        ),
      );
    }

    final campaigns = subscribedCampaignIds
        .map((id) => DataService.getCampaignById(id))
        .whereType<Campaign>()
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Campaigns'),
      ),
      drawer: _buildDrawer(context),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              itemCount: campaigns.length,
              itemBuilder: (context, index) {
                final campaign = campaigns[index];
                final language = appState.getLanguageForCampaign(campaign.id);

                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    title: Text(
                      campaign.name,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text(campaign.shortDescription),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.language, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              'Language: ${getLanguageName(language)}',
                              style: Theme.of(context).textTheme.bodySmall,
                            ),
                          ],
                        ),
                      ],
                    ),
                    trailing: KebabMenu(
                      onAction: (action) {
                        _handleAction(context, action, campaign, appState);
                      },
                    ),
                  ),
                );
              },
            ),
          ),
          // Find New Campaign button
          Container(
            padding: const EdgeInsets.all(16),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, '/campaign-chooser');
                },
                icon: const Icon(Icons.add),
                label: const Text('Find New Campaign'),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _handleAction(
    BuildContext context,
    KebabMenuAction action,
    Campaign campaign,
    AppState appState,
  ) {
    switch (action) {
      case KebabMenuAction.unsubscribe:
        _handleUnsubscribe(context, campaign, appState);
        break;
      case KebabMenuAction.changeLanguage:
        _handleChangeLanguage(context, campaign, appState);
        break;
      case KebabMenuAction.share:
        ShareUtils.shareCampaign(campaign.name, campaign.code);
        break;
    }
  }

  void _handleUnsubscribe(
    BuildContext context,
    Campaign campaign,
    AppState appState,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Unsubscribe'),
        content: Text('Are you sure you want to unsubscribe from ${campaign.name}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              await appState.unsubscribe(campaign.id);
              if (context.mounted) {
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Unsubscribed from ${campaign.name}'),
                  ),
                );
              }
            },
            child: const Text('Unsubscribe'),
          ),
        ],
      ),
    );
  }

  void _handleChangeLanguage(
    BuildContext context,
    Campaign campaign,
    AppState appState,
  ) {
    final currentLanguage = appState.getLanguageForCampaign(campaign.id);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Change Language for ${campaign.name}'),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView.builder(
            shrinkWrap: true,
            itemCount: campaign.languages.length,
            itemBuilder: (context, index) {
              final langCode = campaign.languages[index];

              return RadioListTile<String>(
                title: Text(getLanguageName(langCode)),
                value: langCode,
                groupValue: currentLanguage,
                onChanged: (value) async {
                  if (value != null) {
                    await appState.setLanguage(campaign.id, value);
                    if (context.mounted) {
                      Navigator.of(context).pop();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Language changed to ${getLanguageName(value)}'),
                        ),
                      );
                    }
                  }
                },
              );
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  'Prayer App',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        color: Theme.of(context).colorScheme.onPrimary,
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Prayer Feed'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/prayer-feed');
            },
          ),
          ListTile(
            leading: const Icon(Icons.campaign),
            title: const Text('My Campaigns'),
            onTap: () {
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.search),
            title: const Text('Find Campaign'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/campaign-chooser');
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.share),
            title: const Text('Share App'),
            onTap: () {
              Navigator.pop(context);
              ShareUtils.shareApp();
            },
          ),
        ],
      ),
    );
  }
}

