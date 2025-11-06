import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DataService } from '../services/DataService';
import StateService from '../services/StateService';
import { Campaign } from '../models/Campaign';
import CampaignListItem from '../components/CampaignListItem';
import LanguageSelector from '../components/LanguageSelector';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shareCampaign } from '../utils/shareUtils';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CampaignsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedCampaignForLanguage, setSelectedCampaignForLanguage] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadCampaigns();
      return () => {};
    }, [])
  );

  const loadCampaigns = () => {
    const subscribedIds = StateService.getSubscribedCampaigns();
    const loadedCampaigns = subscribedIds
      .map(id => DataService.getCampaign(id))
      .filter((c): c is Campaign => c !== undefined);
    setCampaigns(loadedCampaigns);
  };

  const handleUnsubscribe = async (campaignId: string) => {
    await StateService.unsubscribeFromCampaign(campaignId);
    loadCampaigns();
  };

  const handleChangeLanguage = (campaignId: string) => {
    setSelectedCampaignForLanguage(campaignId);
    setLanguageModalVisible(true);
  };

  const handleLanguageSelect = async (languageCode: string) => {
    if (selectedCampaignForLanguage) {
      await StateService.setCampaignLanguage(selectedCampaignForLanguage, languageCode);
      setLanguageModalVisible(false);
      setSelectedCampaignForLanguage(null);
    }
  };

  const handleShare = (campaignId: string) => {
    shareCampaign(campaignId);
  };

  const handleFindNewCampaign = () => {
    navigation.navigate('CampaignChooser');
  };

  const renderCampaign = ({ item }: { item: Campaign }) => {
    const availableLanguages = DataService.getAllLanguages().filter(l =>
      item.languages.includes(l.code)
    );
    const currentLanguage = StateService.getCampaignLanguage(item.id);

    return (
      <>
        <CampaignListItem
          campaign={item}
          onUnsubscribe={() => handleUnsubscribe(item.id)}
          onChangeLanguage={() => handleChangeLanguage(item.id)}
          onShare={() => handleShare(item.id)}
        />
        {selectedCampaignForLanguage === item.id && (
          <Modal
            visible={languageModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => {
              setLanguageModalVisible(false);
              setSelectedCampaignForLanguage(null);
            }}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Language</Text>
                <FlatList
                  data={availableLanguages}
                  keyExtractor={lang => lang.code}
                  renderItem={({ item: lang }) => (
                    <TouchableOpacity
                      style={[
                        styles.languageItem,
                        currentLanguage === lang.code && styles.languageItemSelected,
                      ]}
                      onPress={() => handleLanguageSelect(lang.code)}
                    >
                      <Text
                        style={[
                          styles.languageText,
                          currentLanguage === lang.code && styles.languageTextSelected,
                        ]}
                      >
                        {lang.name}
                      </Text>
                      {currentLanguage === lang.code && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setLanguageModalVisible(false);
                    setSelectedCampaignForLanguage(null);
                  }}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </>
    );
  };

  if (campaigns.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No campaigns subscribed</Text>
        <TouchableOpacity style={styles.findButton} onPress={handleFindNewCampaign}>
          <Text style={styles.findButtonText}>Find New Campaign</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={campaigns}
        renderItem={renderCampaign}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <TouchableOpacity style={styles.findButton} onPress={handleFindNewCampaign}>
            <Text style={styles.findButtonText}>Find New Campaign</Text>
          </TouchableOpacity>
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
  listContent: {
    paddingBottom: spacing.lg,
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
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  findButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    margin: spacing.md,
  },
  findButtonText: {
    ...typography.button,
    color: colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '80%',
    maxHeight: '60%',
    padding: spacing.md,
  },
  modalTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  languageItemSelected: {
    backgroundColor: colors.surface,
  },
  languageText: {
    ...typography.body,
    color: colors.text,
  },
  languageTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    ...typography.body,
    color: colors.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closeButtonText: {
    ...typography.button,
    color: colors.primary,
  },
});

export default CampaignsScreen;
