import 'package:flutter/material.dart';
import '../models/fuel.dart';
import '../models/campaign.dart';
import '../utils/date_utils.dart';

class PrayerFuelItem extends StatelessWidget {
  final Fuel fuel;
  final Campaign campaign;
  final bool isPrayed;
  final VoidCallback onTap;

  const PrayerFuelItem({
    super.key,
    required this.fuel,
    required this.campaign,
    required this.isPrayed,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Get first available language content for description
    final content = fuel.languages.values.first;
    final description = content.blocks
        .where((b) => b.type == FuelBlockType.paragraph)
        .map((b) => b.content ?? '')
        .join(' ');

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: isPrayed
          ? Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3)
          : null,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              if (isPrayed)
                Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: Icon(
                    Icons.check_circle,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.primaryContainer,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            campaign.name,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Theme.of(context).colorScheme.onPrimaryContainer,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Day ${fuel.day}',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      description.isNotEmpty
                          ? (description.length > 100
                              ? '${description.substring(0, 100)}...'
                              : description)
                          : 'Prayer content for ${campaign.name}',
                      style: Theme.of(context).textTheme.bodyMedium,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      formatDateShort(fuel.date),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6),
                          ),
                    ),
                  ],
                ),
              ),
              Icon(
                Icons.chevron_right,
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.5),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

