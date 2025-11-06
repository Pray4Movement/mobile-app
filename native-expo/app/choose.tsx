import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '@/components/SearchBar';
import { FilterChips } from '@/components/FilterChips';
import { CampaignCard } from '@/components/CampaignCard';
import { campaigns } from '@/data/campaigns';
import { groups } from '@/data/groups';
import { languages } from '@/data/languages';
import { useAppStore } from '@/state/store';
import { theme } from '@/theme';
import { t } from '@/utils/i18n';

export default function ChooseScreen() {
  const router = useRouter();
  const subscribe = useAppStore((state) => state.subscribe);
  const subscribedCampaignIds = useAppStore((state) => state.subscribedCampaignIds);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [campaignCode, setCampaignCode] = useState('');

  const filteredCampaigns = useMemo(() => {
    let result = campaigns;

    // Filter by campaign code (exact match)
    if (campaignCode.trim()) {
      const codeMatch = campaigns.find(
        (c) => c.code?.toUpperCase() === campaignCode.trim().toUpperCase()
      );
      if (codeMatch) {
        result = [codeMatch];
      } else {
        result = [];
      }
    } else {
      // Apply other filters only if no code is entered
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.shortDescription.toLowerCase().includes(query)
        );
      }

      // Filter by languages
      if (selectedLanguages.length > 0) {
        result = result.filter((c) =>
          selectedLanguages.some((lang) => c.languages.includes(lang))
        );
      }

      // Filter by groups
      if (selectedGroups.length > 0) {
        result = result.filter((c) => selectedGroups.includes(c.groupId));
      }
    }

    // Group by groupId
    const grouped = result.reduce((acc, campaign) => {
      const groupId = campaign.groupId;
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(campaign);
      return acc;
    }, {} as Record<string, typeof campaigns>);

    return grouped;
  }, [searchQuery, selectedLanguages, selectedGroups, campaignCode]);

  const flatListData = useMemo(() => {
    const data: Array<{ type: 'header' | 'item'; groupId?: string; campaign?: typeof campaigns[0] }> = [];
    Object.entries(filteredCampaigns).forEach(([groupId, campaigns]) => {
      const group = groups.find((g) => g.id === groupId);
      data.push({ type: 'header', groupId, campaign: undefined });
      campaigns.forEach((campaign) => {
        data.push({ type: 'item', groupId, campaign });
      });
    });
    return data;
  }, [filteredCampaigns]);

  const totalCount = useMemo(() => {
    return Object.values(filteredCampaigns).reduce((sum, arr) => sum + arr.length, 0);
  }, [filteredCampaigns]);

  const handleCampaignPress = (campaignId: string) => {
    subscribe(campaignId);
    router.replace('/(tabs)/feed');
  };

  const languageFilters = languages.map((lang) => ({
    id: lang.code,
    label: lang.name,
  }));

  const groupFilters = groups.map((group) => ({
    id: group.id,
    label: group.name,
  }));

  const renderItem = ({ item }: { item: typeof flatListData[0] }) => {
    if (item.type === 'header') {
      const group = groups.find((g) => g.id === item.groupId);
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{group?.name || 'Other'}</Text>
        </View>
      );
    }
    if (item.campaign) {
      return (
        <CampaignCard
          campaign={item.campaign}
          onPress={() => handleCampaignPress(item.campaign!.id)}
          isSubscribed={subscribedCampaignIds.includes(item.campaign.id)}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('choose.title')}</Text>
        <Text style={styles.count}>{t('choose.count', { count: totalCount })}</Text>
      </View>

      <ScrollView style={styles.filtersContainer} nestedScrollEnabled>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('choose.search')}
          />
        </View>

        <View style={styles.codeContainer}>
          <TextInput
            style={styles.codeInput}
            value={campaignCode}
            onChangeText={setCampaignCode}
            placeholder={t('choose.code')}
            placeholderTextColor={theme.colors.textLight}
            autoCapitalize="characters"
          />
        </View>

        <FilterChips
          filters={languageFilters}
          selectedIds={selectedLanguages}
          onToggle={(id) => {
            setSelectedLanguages((prev) =>
              prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
            );
          }}
          title={t('choose.filterLanguage')}
        />

        <FilterChips
          filters={groupFilters}
          selectedIds={selectedGroups}
          onToggle={(id) => {
            setSelectedGroups((prev) =>
              prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
            );
          }}
          title={t('choose.filterGroup')}
        />
      </ScrollView>

      {totalCount === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t('choose.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={flatListData}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `header-${item.groupId}` : `item-${item.campaign?.id}-${index}`
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
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  count: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  filtersContainer: {
    maxHeight: 200,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  codeContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  codeInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
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

