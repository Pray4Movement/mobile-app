import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/state/store';
import { getCampaignById } from '@/data/campaigns';
import { getFuelByDate } from '@/data/fuel';
import { createFuelId } from '@/utils/ids';
import { formatDate, formatTime, formatDays } from '@/utils/format';
import { theme } from '@/theme';
import { t } from '@/utils/i18n';

interface FeedItem {
  id: string;
  date: string;
  campaignId: string;
  campaignName: string;
  day: number;
  shortDescription: string;
  isPrayed: boolean;
}

export default function FeedScreen() {
  const router = useRouter();
  const subscribedCampaignIds = useAppStore((state) => state.subscribedCampaignIds);
  const reminders = useAppStore((state) => state.reminders);
  const prayed = useAppStore((state) => state.prayed);

  const feedItems = useMemo(() => {
    const items: FeedItem[] = [];
    const dateRange = 7; // Show today ± 7 days

    for (let i = -dateRange; i <= dateRange; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      // Get fuel for this date from subscribed campaigns
      const dateFuel = getFuelByDate(dateString);
      dateFuel.forEach((f) => {
        if (subscribedCampaignIds.includes(f.campaignId)) {
          const campaign = getCampaignById(f.campaignId);
          if (campaign) {
            const fuelId = createFuelId(f.campaignId, f.day);
            items.push({
              id: fuelId,
              date: dateString,
              campaignId: f.campaignId,
              campaignName: campaign.name,
              day: f.day,
              shortDescription: campaign.shortDescription,
              isPrayed: prayed[fuelId] || false,
            });
          }
        }
      });
    }

    // Group by date
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {} as Record<string, FeedItem[]>);

    // Convert to flat list with headers
    const result: Array<{ type: 'header' | 'item'; date?: string; item?: FeedItem }> = [];
    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, items]) => {
        result.push({ type: 'header', date });
        items.forEach((item) => {
          result.push({ type: 'item', item });
        });
      });

    return result;
  }, [subscribedCampaignIds, prayed]);

  const remindersSummary = useMemo(() => {
    if (reminders.length === 0) {
      return t('feed.reminders.none');
    }
    const firstReminder = reminders[0];
    return `${formatTime(firstReminder.time)} - ${formatDays(firstReminder.days)}`;
  }, [reminders]);

  const handleItemPress = (item: FeedItem) => {
    router.push(`/fuel/${item.id}`);
  };

  const renderItem = ({ item }: { item: typeof feedItems[0] }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{formatDate(item.date!)}</Text>
        </View>
      );
    }

    const feedItem = item.item!;
    return (
      <TouchableOpacity
        style={[styles.feedItem, feedItem.isPrayed && styles.feedItemPrayed]}
        onPress={() => handleItemPress(feedItem)}
        activeOpacity={0.7}
      >
        <View style={styles.feedItemContent}>
          <View style={styles.feedItemHeader}>
            <Text style={styles.campaignName}>{feedItem.campaignName}</Text>
            {feedItem.isPrayed && (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            )}
          </View>
          <Text style={styles.dayText}>Day {feedItem.day}</Text>
          <Text style={styles.description}>{feedItem.shortDescription}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.remindersSection}>
        <View style={styles.remindersContent}>
          <Ionicons name="notifications-outline" size={20} color={theme.colors.textSecondary} />
          <View style={styles.remindersText}>
            <Text style={styles.remindersLabel}>{t('feed.reminders.summary')}</Text>
            <Text style={styles.remindersValue}>{remindersSummary}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/reminders')}
        >
          <Text style={styles.editButtonText}>{t('feed.reminders.edit')}</Text>
        </TouchableOpacity>
      </View>

      {feedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('feed.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={feedItems}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `header-${item.date}` : `item-${item.item?.id}-${index}`
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  remindersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  remindersContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  remindersText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  remindersLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  remindersValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  editButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  sectionHeaderText: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  feedItemPrayed: {
    opacity: 0.6,
    backgroundColor: theme.colors.surface,
  },
  feedItemContent: {
    flex: 1,
  },
  feedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  campaignName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
  },
  dayText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

