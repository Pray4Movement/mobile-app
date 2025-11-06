import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Fuel } from '../models/Fuel';
import { Campaign } from '../models/Campaign';

interface PrayerFuelItemProps {
  fuel: Fuel;
  campaign: Campaign;
  isPrayed: boolean;
  onPress: () => void;
}

const PrayerFuelItem: React.FC<PrayerFuelItemProps> = ({ fuel, campaign, isPrayed, onPress }) => {
  // Get first available language content for description
  const firstLanguage = Object.keys(fuel.languages)[0];
  const content = fuel.languages[firstLanguage];
  const firstParagraph = content.blocks.find(b => b.type === 'paragraph');
  const description = firstParagraph?.content || campaign.shortDescription;

  return (
    <TouchableOpacity
      style={[styles.container, isPrayed && styles.containerPrayed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.campaignName}>{campaign.name}</Text>
        {isPrayed && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      <Text style={styles.day}>Day {fuel.day}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerPrayed: {
    borderColor: colors.prayed,
    borderWidth: 2,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  campaignName: {
    ...typography.h5,
    color: colors.text,
    flex: 1,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.prayed,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  day: {
    ...typography.caption,
    color: colors.textLight,
  },
});

export default PrayerFuelItem;

