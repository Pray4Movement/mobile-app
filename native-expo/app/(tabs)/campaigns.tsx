import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KebabMenu } from '@/components/KebabMenu';
import { useAppStore } from '@/state/store';
import { getCampaignById } from '@/data/campaigns';
import { languages } from '@/data/languages';
import { shareCampaign } from '@/utils/share';
import { theme } from '@/theme';
import { t } from '@/utils/i18n';

export default function CampaignsScreen() {
  const router = useRouter();
  const subscribedCampaignIds = useAppStore((state) => state.subscribedCampaignIds);
  const unsubscribe = useAppStore((state) => state.unsubscribe);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const preferences = useAppStore((state) => state.preferences);

  const campaigns = subscribedCampaignIds
    .map((id) => getCampaignById(id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const handleKebabAction = (campaignId: string, action: string) => {
    const campaign = getCampaignById(campaignId);
    if (!campaign) return;

    switch (action) {
      case 'unsubscribe':
        unsubscribe(campaignId);
        break;
      case 'changeLanguage':
        // Simple language picker - cycle through available languages
        const currentLang =
          preferences.languageByCampaign[campaignId] || campaign.languages[0];
        const currentIndex = campaign.languages.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % campaign.languages.length;
        setLanguage(campaignId, campaign.languages[nextIndex]);
        break;
      case 'share':
        shareCampaign(campaign.name, campaign.code);
        break;
    }
  };

  const renderItem = ({ item: campaign }: { item: typeof campaigns[0] }) => {
    const currentLang =
      preferences.languageByCampaign[campaign.id] || campaign.languages[0];
    const langName = languages.find((l) => l.code === currentLang)?.name || currentLang;

    const menuItems = [
      {
        id: 'changeLanguage',
        label: `${t('campaigns.changeLanguage')} (${langName})`,
        icon: 'language' as const,
      },
      {
        id: 'share',
        label: t('campaigns.share'),
        icon: 'share-outline' as const,
      },
      {
        id: 'unsubscribe',
        label: t('campaigns.unsubscribe'),
        icon: 'remove-circle-outline' as const,
        destructive: true,
      },
    ];

    return (
      <View style={styles.campaignItem}>
        <View style={styles.campaignContent}>
          <Text style={styles.campaignName}>{campaign.name}</Text>
          <Text style={styles.campaignDescription}>{campaign.shortDescription}</Text>
          <Text style={styles.languageText}>Language: {langName}</Text>
        </View>
        <KebabMenu
          items={menuItems}
          onSelect={(id) => handleKebabAction(campaign.id, id)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {campaigns.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('campaigns.empty')}</Text>
          <TouchableOpacity
            style={styles.findButton}
            onPress={() => router.push('/choose')}
          >
            <Text style={styles.findButtonText}>{t('campaigns.findNew')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={campaigns}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.findButton}
              onPress={() => router.push('/choose')}
            >
              <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.findButtonText}>{t('campaigns.findNew')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  campaignItem: {
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
  campaignContent: {
    flex: 1,
  },
  campaignName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  campaignDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  languageText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    backgroundColor: theme.colors.background,
  },
  findButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  findButtonText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
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
    marginBottom: theme.spacing.lg,
  },
});

