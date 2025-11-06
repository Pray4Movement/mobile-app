import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Campaign } from '../models/Campaign';

interface CampaignCardProps {
  campaign: Campaign;
  isSubscribed: boolean;
  onPress: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, isSubscribed, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, isSubscribed && styles.cardSubscribed]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{campaign.name}</Text>
        {isSubscribed && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✓ Subscribed</Text>
          </View>
        )}
      </View>
      <Text style={styles.description}>{campaign.shortDescription}</Text>
      {campaign.code && (
        <Text style={styles.code}>Code: {campaign.code}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSubscribed: {
    borderColor: colors.subscribed,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.subscribed,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  code: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});

export default CampaignCard;

