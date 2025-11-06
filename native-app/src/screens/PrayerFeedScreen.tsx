import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DataService } from '../services/DataService';
import StateService from '../services/StateService';
import { Fuel } from '../models/Fuel';
import { Campaign } from '../models/Campaign';
import { Reminder } from '../models/Reminder';
import ReminderDisplay from '../components/ReminderDisplay';
import ReminderEditor from '../components/ReminderEditor';
import PrayerFuelItem from '../components/PrayerFuelItem';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { groupByDate, formatDate } from '../utils/dateUtils';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface PrayerFuelGroup {
  date: string;
  fuels: Array<{ fuel: Fuel; campaign: Campaign }>;
}

const PrayerFeedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [showReminderEditor, setShowReminderEditor] = useState(false);
  const [reminder, setReminder] = useState<Reminder | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadReminder();
      return () => {};
    }, [])
  );

  const loadReminder = async () => {
    const reminders = StateService.getReminders();
    setReminder(reminders.length > 0 ? reminders[0] : null);
  };

  const subscribedCampaigns = StateService.getSubscribedCampaigns();
  const prayedItems = StateService.getPrayedItems();

  // Get all fuel for subscribed campaigns
  const prayerFuelGroups = useMemo(() => {
    if (subscribedCampaigns.length === 0) {
      return [];
    }

    const allFuel = DataService.getFuelForCampaigns(subscribedCampaigns);
    const fuelWithCampaigns = allFuel
      .map(fuel => {
        const campaign = DataService.getCampaign(fuel.campaignId);
        return campaign ? { fuel, campaign } : null;
      })
      .filter((item): item is { fuel: Fuel; campaign: Campaign } => item !== null);

    // Group by date
    const grouped = groupByDate(fuelWithCampaigns.map(item => ({ ...item, date: item.fuel.date })));

    // Convert to array and sort by date (most recent first)
    return Object.entries(grouped)
      .map(([date, items]) => ({ date, fuels: items }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [subscribedCampaigns]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReminder();
    setRefreshing(false);
  };

  const handleReminderSave = async (newReminder: Reminder) => {
    if (reminder) {
      await StateService.updateReminder(reminder.id, newReminder);
    } else {
      await StateService.addReminder(newReminder);
    }
    await loadReminder();
    setShowReminderEditor(false);
  };

  const handleFuelPress = (fuel: Fuel, campaign: Campaign) => {
    navigation.navigate('PrayerFuel', {
      campaignId: campaign.id,
      day: fuel.day,
    });
  };

  const renderFuelGroup = ({ item }: { item: PrayerFuelGroup }) => (
    <View style={styles.groupContainer}>
      <Text style={styles.dateHeader}>{formatDate(item.date)}</Text>
      {item.fuels.map(({ fuel, campaign }) => (
        <PrayerFuelItem
          key={fuel.id}
          fuel={fuel}
          campaign={campaign}
          isPrayed={StateService.isPrayed(fuel.id)}
          onPress={() => handleFuelPress(fuel, campaign)}
        />
      ))}
    </View>
  );

  if (subscribedCampaigns.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No campaigns subscribed</Text>
        <Text style={styles.emptySubtext}>
          Go to the Campaigns tab to find and subscribe to campaigns
        </Text>
      </View>
    );
  }

  const campaigns = subscribedCampaigns
    .map(id => DataService.getCampaign(id))
    .filter((c): c is Campaign => c !== undefined);

  return (
    <View style={styles.container}>
      <ReminderDisplay
        reminder={reminder}
        onEdit={() => setShowReminderEditor(true)}
      />

      <FlatList
        data={prayerFuelGroups}
        renderItem={renderFuelGroup}
        keyExtractor={item => item.date}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No prayer fuel available</Text>
          </View>
        }
      />

      <ReminderEditor
        visible={showReminderEditor}
        reminder={reminder}
        campaigns={campaigns}
        onSave={handleReminderSave}
        onCancel={() => setShowReminderEditor(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  groupContainer: {
    marginTop: spacing.md,
  },
  dateHeader: {
    ...typography.h5,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default PrayerFeedScreen;
