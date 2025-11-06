import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { Campaign } from '@/data/campaigns';
import { getGroupById } from '@/data/groups';

interface CampaignCardProps {
  campaign: Campaign;
  onPress: () => void;
  isSubscribed?: boolean;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onPress,
  isSubscribed = false,
}) => {
  const group = getGroupById(campaign.groupId);

  return (
    <TouchableOpacity
      style={[styles.card, isSubscribed && styles.cardSubscribed]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{campaign.name}</Text>
          {group && <Text style={styles.group}>{group.name}</Text>}
        </View>
        {isSubscribed && (
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
        )}
      </View>
      <Text style={styles.description}>{campaign.shortDescription}</Text>
      {campaign.code && (
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Code: </Text>
          <Text style={styles.code}>{campaign.code}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardSubscribed: {
    borderColor: theme.colors.success,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  headerContent: {
    flex: 1,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  group: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  codeContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.xs,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  codeLabel: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  code: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

