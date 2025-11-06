import 'package:flutter/material.dart';
import '../models/campaign.dart';
import '../services/data_service.dart';

class CampaignCard extends StatelessWidget {
  final Campaign campaign;
  final VoidCallback? onSubscribe;
  final bool isSubscribed;

  const CampaignCard({
    super.key,
    required this.campaign,
    this.onSubscribe,
    this.isSubscribed = false,
  });

  @override
  Widget build(BuildContext context) {
    final group = DataService.getGroupById(campaign.groupId);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (group != null)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primaryContainer,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      group.name,
                      style: TextStyle(
                        fontSize: 12,
                        color: Theme.of(context).colorScheme.onPrimaryContainer,
                      ),
                    ),
                  ),
                const Spacer(),
                if (isSubscribed)
                  Icon(
                    Icons.check_circle,
                    color: Theme.of(context).colorScheme.primary,
                    size: 20,
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              campaign.name,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              campaign.shortDescription,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                  ),
            ),
            const SizedBox(height: 12),
            if (onSubscribe != null)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isSubscribed ? null : onSubscribe,
                  child: Text(isSubscribed ? 'Subscribed' : 'Subscribe'),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

