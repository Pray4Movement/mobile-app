import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/fuel.dart';
import '../models/reminder.dart';
import '../services/data_service.dart';
import '../services/state_service.dart';
import '../utils/date_utils.dart';
import '../widgets/reminder_editor.dart';
import '../widgets/prayer_fuel_item.dart';
import '../utils/share_utils.dart';

class PrayerFeedScreen extends StatefulWidget {
  const PrayerFeedScreen({super.key});

  @override
  State<PrayerFeedScreen> createState() => _PrayerFeedScreenState();
}

class _PrayerFeedScreenState extends State<PrayerFeedScreen> {

  @override
  Widget build(BuildContext context) {
    final appState = Provider.of<AppState>(context);
    final subscribedCampaignIds = appState.subscribedCampaignIds;

    // Get all fuel for subscribed campaigns
    final allFuel = <Fuel>[];
    for (var campaignId in subscribedCampaignIds) {
      allFuel.addAll(DataService.getFuelByCampaign(campaignId));
    }

    // Group fuel by date
    final Map<String, List<Fuel>> fuelByDate = {};
    for (var fuel in allFuel) {
      if (!fuelByDate.containsKey(fuel.date)) {
        fuelByDate[fuel.date] = [];
      }
      fuelByDate[fuel.date]!.add(fuel);
    }

    // Sort dates
    final sortedDates = fuelByDate.keys.toList()..sort();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Prayer Feed'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              ShareUtils.shareApp();
            },
            tooltip: 'Share App',
          ),
        ],
      ),
      drawer: _buildDrawer(context),
      body: Column(
        children: [
          // Reminder schedule section
          Container(
            padding: const EdgeInsets.all(16),
            color: Theme.of(context).colorScheme.surfaceContainerHighest,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Reminders',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        _showReminderEditorDialog(context, null);
                      },
                      icon: const Icon(Icons.add),
                      label: const Text('Add Reminder'),
                    ),
                  ],
                ),
                if (appState.reminders.isEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      'No reminders set. Add one to get started!',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context)
                                .colorScheme
                                .onSurface
                                .withOpacity(0.6),
                          ),
                    ),
                  )
                else
                  ...appState.reminders.map((reminder) {
                    return _buildReminderItem(context, reminder, appState);
                  }),
              ],
            ),
          ),
          // Prayer fuel list
          Expanded(
            child: sortedDates.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.favorite,
                          size: 64,
                          color: Theme.of(context)
                              .colorScheme
                              .onSurface
                              .withOpacity(0.3),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No prayer fuel available',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                color: Theme.of(context)
                                    .colorScheme
                                    .onSurface
                                    .withOpacity(0.5),
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Subscribe to campaigns to see prayer content',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: Theme.of(context)
                                    .colorScheme
                                    .onSurface
                                    .withOpacity(0.5),
                              ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: sortedDates.length,
                    itemBuilder: (context, index) {
                      final date = sortedDates[index];
                      final fuels = fuelByDate[date]!;

                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                            child: Text(
                              formatDate(date),
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                          ),
                          ...fuels.map((fuel) {
                            final campaign =
                                DataService.getCampaignById(fuel.campaignId);
                            if (campaign == null) return const SizedBox.shrink();

                            final isPrayed = appState.isPrayed(fuel.id);

                            return PrayerFuelItem(
                              fuel: fuel,
                              campaign: campaign,
                              isPrayed: isPrayed,
                              onTap: () {
                                Navigator.pushNamed(
                                  context,
                                  '/prayer-fuel',
                                  arguments: {
                                    'campaignId': fuel.campaignId,
                                    'day': fuel.day,
                                  },
                                );
                              },
                            );
                          }),
                        ],
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.pushNamed(context, '/campaign-chooser');
        },
        child: const Icon(Icons.add),
        tooltip: 'Find Campaign',
      ),
    );
  }

  Widget _buildReminderItem(
      BuildContext context, Reminder reminder, AppState appState) {
    final campaign = reminder.campaignId != null
        ? DataService.getCampaignById(reminder.campaignId!)
        : null;

    return Card(
      margin: const EdgeInsets.only(top: 8),
      child: ListTile(
        leading: const Icon(Icons.notifications),
        title: Text(reminder.time),
        subtitle: Text(
          campaign != null
              ? '${reminder.days.length} days - ${campaign.name}'
              : '${reminder.days.length} days - All campaigns',
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                _showReminderEditorDialog(context, reminder);
              },
            ),
            IconButton(
              icon: const Icon(Icons.delete),
              onPressed: () async {
                await appState.deleteReminder(reminder.id);
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showReminderEditorDialog(BuildContext context, Reminder? editingReminder) {
    showDialog(
      context: context,
      builder: (context) => ReminderEditor(
        reminder: editingReminder,
        onSave: (reminder) async {
          final appState = Provider.of<AppState>(context, listen: false);
          if (editingReminder != null) {
            await appState.updateReminder(editingReminder.id, reminder);
          } else {
            await appState.addReminder(reminder);
          }
          if (context.mounted) {
            Navigator.of(context).pop();
          }
        },
        onCancel: () {
          Navigator.of(context).pop();
        },
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
            },
          ),
          ListTile(
            leading: const Icon(Icons.campaign),
            title: const Text('My Campaigns'),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, '/campaigns');
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

