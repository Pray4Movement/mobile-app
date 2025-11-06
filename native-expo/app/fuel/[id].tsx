import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { JsonContentRenderer } from '@/components/JsonContentRenderer';
import { useAppStore } from '@/state/store';
import { getFuelById } from '@/data/fuel';
import { getCampaignById } from '@/data/campaigns';
import { languages, defaultLanguage } from '@/data/languages';
import { shareFuel } from '@/utils/share';
import { theme } from '@/theme';
import { t } from '@/utils/i18n';

export default function FuelScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const markPrayed = useAppStore((state) => state.markPrayed);
  const unmarkPrayed = useAppStore((state) => state.unmarkPrayed);
  const prayed = useAppStore((state) => state.prayed);
  const preferences = useAppStore((state) => state.preferences);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const fuel = useMemo(() => {
    if (!id) return null;
    return getFuelById(id) || null;
  }, [id]);

  const campaign = useMemo(() => {
    if (!fuel) return null;
    return getCampaignById(fuel.campaignId);
  }, [fuel]);

  const currentLanguage = useMemo(() => {
    if (!fuel || !campaign) return defaultLanguage.code;
    return preferences.languageByCampaign[fuel.campaignId] || campaign.languages[0] || defaultLanguage.code;
  }, [fuel, campaign, preferences]);

  const content = useMemo(() => {
    if (!fuel) return null;
    return fuel.languages[currentLanguage] || fuel.languages[defaultLanguage.code] || Object.values(fuel.languages)[0];
  }, [fuel, currentLanguage]);

  const isPrayed = useMemo(() => {
    return id ? prayed[id] || false : false;
  }, [id, prayed]);

  const availableLanguages = useMemo(() => {
    if (!campaign) return [];
    return languages.filter((lang) => campaign.languages.includes(lang.code));
  }, [campaign]);

  const handlePrayed = () => {
    if (!id) return;
    if (isPrayed) {
      unmarkPrayed(id);
    } else {
      markPrayed(id);
    }
    router.back();
  };

  const handleShare = async () => {
    if (!campaign || !fuel) return;
    await shareFuel(campaign.name, fuel.day);
  };

  const handleLanguageChange = (langCode: string) => {
    if (!fuel) return;
    setLanguage(fuel.campaignId, langCode);
  };

  if (!fuel || !campaign || !content) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Prayer Fuel</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Content not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{campaign.name}</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {availableLanguages.length > 1 && (
        <View style={styles.languageSelector}>
          <Text style={styles.languageLabel}>{t('fuel.language')}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageChip,
                  currentLanguage === lang.code && styles.languageChipSelected,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text
                  style={[
                    styles.languageChipText,
                    currentLanguage === lang.code && styles.languageChipTextSelected,
                  ]}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.contentContainer}>
        <JsonContentRenderer blocks={content.blocks} />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.prayedButton, isPrayed && styles.prayedButtonActive]}
          onPress={handlePrayed}
        >
          <Ionicons
            name={isPrayed ? 'checkmark-circle' : 'checkmark-circle-outline'}
            size={24}
            color={isPrayed ? '#FFFFFF' : theme.colors.primary}
          />
          <Text style={[styles.prayedButtonText, isPrayed && styles.prayedButtonTextActive]}>
            {isPrayed ? t('fuel.prayedMarked') : t('fuel.prayed')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 24,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    backgroundColor: theme.colors.surface,
  },
  languageLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
  },
  languageChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  languageChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  languageChipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  languageChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
    backgroundColor: theme.colors.background,
  },
  prayedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  prayedButtonActive: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  prayedButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
  prayedButtonTextActive: {
    color: '#FFFFFF',
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
  },
});

