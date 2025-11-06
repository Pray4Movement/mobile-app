import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DataService } from '../services/DataService';
import StateService from '../services/StateService';
import { Campaign } from '../models/Campaign';
import SearchBar from '../components/SearchBar';
import CampaignCodeInput from '../components/CampaignCodeInput';
import FilterChips from '../components/FilterChips';
import CampaignCard from '../components/CampaignCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CampaignChooser'>;

const CampaignChooserScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [campaignCode, setCampaignCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = DataService.getAllGroups();
  const languages = DataService.getAllLanguages();
  const subscribedCampaigns = StateService.getSubscribedCampaigns();

  // Filter campaigns based on all criteria
  const filteredCampaigns = useMemo(() => {
    let campaigns = DataService.getAllCampaigns();

    // Campaign code filter (direct match, highest priority)
    if (campaignCode.trim()) {
      const codeMatch = DataService.getCampaignByCode(campaignCode.trim());
      return codeMatch ? [codeMatch] : [];
    }

    // Search filter
    if (searchQuery.trim()) {
      campaigns = DataService.searchCampaigns(searchQuery);
    }

    // Language filter
    if (selectedLanguage) {
      campaigns = campaigns.filter(c => c.languages.includes(selectedLanguage));
    }

    // Group filter
    if (selectedGroup) {
      campaigns = campaigns.filter(c => c.groupId === selectedGroup);
    }

    return campaigns;
  }, [searchQuery, campaignCode, selectedLanguage, selectedGroup]);

  // Group campaigns by groupId for display
  const groupedCampaigns = useMemo(() => {
    const groupsMap = new Map<string, Campaign[]>();

    filteredCampaigns.forEach(campaign => {
      const groupId = campaign.groupId;
      if (!groupsMap.has(groupId)) {
        groupsMap.set(groupId, []);
      }
      groupsMap.get(groupId)!.push(campaign);
    });

    return Array.from(groupsMap.entries()).map(([groupId, campaigns]) => ({
      title: groups.find(g => g.id === groupId)?.name || groupId,
      data: campaigns,
    }));
  }, [filteredCampaigns, groups]);

  const handleSubscribe = async (campaignId: string) => {
    await StateService.subscribeToCampaign(campaignId);
    // Navigate to Prayer Feed after subscription
    navigation.replace('MainTabs');
  };

  const handleGroupToggle = (groupId: string) => {
    setSelectedGroup(selectedGroup === groupId ? null : groupId);
  };

  const handleLanguageToggle = (languageCode: string) => {
    setSelectedLanguage(selectedLanguage === languageCode ? null : languageCode);
  };

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <CampaignCard
      campaign={item}
      isSubscribed={StateService.isSubscribed(item.id)}
      onPress={() => handleSubscribe(item.id)}
    />
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      <CampaignCodeInput value={campaignCode} onChangeText={setCampaignCode} />

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by Group:</Text>
        <FilterChips
          items={groups.map(g => ({ id: g.id, label: g.name }))}
          selectedIds={selectedGroup ? [selectedGroup] : []}
          onToggle={handleGroupToggle}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by Language:</Text>
        <FilterChips
          items={languages.map(l => ({ id: l.code, label: l.name }))}
          selectedIds={selectedLanguage ? [selectedLanguage] : []}
          onToggle={handleLanguageToggle}
        />
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <SectionList
        sections={groupedCampaigns}
        renderItem={renderCampaign}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No campaigns found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterSection: {
    marginVertical: spacing.sm,
  },
  filterLabel: {
    ...typography.bodySmall,
    color: colors.text,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  countContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  countText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  sectionHeader: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textLight,
  },
});

export default CampaignChooserScreen;
