import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Campaign } from '../models/Campaign';
import KebabMenu from './KebabMenu';

interface CampaignListItemProps {
  campaign: Campaign;
  onUnsubscribe: () => void;
  onChangeLanguage: () => void;
  onShare: () => void;
}

const CampaignListItem: React.FC<CampaignListItemProps> = ({
  campaign,
  onUnsubscribe,
  onChangeLanguage,
  onShare,
}) => {
  const menuOptions = [
    { label: 'Change Language', onPress: onChangeLanguage },
    { label: 'Share', onPress: onShare },
    { label: 'Unsubscribe', onPress: onUnsubscribe, destructive: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{campaign.name}</Text>
        <Text style={styles.description}>{campaign.shortDescription}</Text>
      </View>
      <KebabMenu options={menuOptions} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});

export default CampaignListItem;

