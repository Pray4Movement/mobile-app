import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppStore } from '@/state/store';
import { theme } from '@/theme';

export default function Index() {
  const subscribedCampaignIds = useAppStore((state) => state.subscribedCampaignIds);
  const loadState = useAppStore((state) => state.loadState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadState()
      .then(() => setLoaded(true))
      .catch((error) => {
        console.error('Failed to load state:', error);
        setLoaded(true); // Continue even if loading fails
      });
  }, [loadState]);

  if (!loaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If user has subscriptions, go to feed, otherwise go to campaign chooser
  if (subscribedCampaignIds.length > 0) {
    return <Redirect href="/(tabs)/feed" />;
  }

  return <Redirect href="/choose" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});

