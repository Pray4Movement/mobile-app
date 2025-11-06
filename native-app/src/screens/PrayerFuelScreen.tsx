import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DataService } from '../services/DataService';
import StateService from '../services/StateService';
import JsonContentRenderer from '../components/JsonContentRenderer';
import LanguageSelector from '../components/LanguageSelector';
import ShareButton from '../components/ShareButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { sharePrayerFuel } from '../utils/shareUtils';

type PrayerFuelRouteProp = RouteProp<RootStackParamList, 'PrayerFuel'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'PrayerFuel'>;

const PrayerFuelScreen: React.FC = () => {
  const route = useRoute<PrayerFuelRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { campaignId, day } = route.params;

  const campaign = DataService.getCampaign(campaignId);
  const fuel = DataService.getFuelByCampaignAndDay(campaignId, day);
  const campaignLanguage = StateService.getCampaignLanguage(campaignId);
  const isPrayed = fuel ? StateService.isPrayed(fuel.id) : false;

  const [selectedLanguage, setSelectedLanguage] = useState<string>(campaignLanguage);

  useEffect(() => {
    if (campaign && !campaign.languages.includes(selectedLanguage)) {
      setSelectedLanguage(campaign.languages[0] || 'en');
    }
  }, [campaign, selectedLanguage]);

  const availableLanguages = useMemo(() => {
    if (!campaign) return [];
    return DataService.getAllLanguages().filter(l => campaign.languages.includes(l.code));
  }, [campaign]);

  const content = useMemo(() => {
    if (!fuel) return null;
    return fuel.languages[selectedLanguage] || fuel.languages[Object.keys(fuel.languages)[0]];
  }, [fuel, selectedLanguage]);

  const handleLanguageChange = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    if (campaign) {
      await StateService.setCampaignLanguage(campaignId, languageCode);
    }
  };

  const handlePrayed = async () => {
    if (fuel && !isPrayed) {
      await StateService.markAsPrayed(fuel.id);
      navigation.goBack();
    }
  };

  const handleShare = () => {
    if (fuel) {
      sharePrayerFuel(fuel.id);
    }
  };

  if (!campaign || !fuel || !content) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Prayer fuel not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.campaignName}>{campaign.name}</Text>
          <Text style={styles.dayText}>Day {fuel.day}</Text>
        </View>

        <View style={styles.controls}>
          <LanguageSelector
            languages={availableLanguages}
            selectedLanguage={selectedLanguage}
            onSelect={handleLanguageChange}
          />
          <ShareButton onPress={handleShare} />
        </View>

        <View style={styles.content}>
          <JsonContentRenderer blocks={content.blocks} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.prayedButton, isPrayed && styles.prayedButtonDisabled]}
          onPress={handlePrayed}
          disabled={isPrayed}
        >
          <Text style={[styles.prayedButtonText, isPrayed && styles.prayedButtonTextDisabled]}>
            {isPrayed ? '✓ Prayed' : 'I prayed'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.md,
  },
  campaignName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  dayText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  prayedButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  prayedButtonDisabled: {
    backgroundColor: colors.success,
  },
  prayedButtonText: {
    ...typography.button,
    color: colors.white,
  },
  prayedButtonTextDisabled: {
    opacity: 0.8,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default PrayerFuelScreen;
