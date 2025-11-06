import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import StateService from '../services/StateService';
import CampaignChooserScreen from '../screens/CampaignChooserScreen';
import PrayerFeedScreen from '../screens/PrayerFeedScreen';
import PrayerFuelScreen from '../screens/PrayerFuelScreen';
import CampaignsScreen from '../screens/CampaignsScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  MainTabs: undefined;
  CampaignChooser: undefined;
  PrayerFuel: { campaignId: string; day: number };
};

export type MainTabParamList = {
  PrayerFeed: undefined;
  Campaigns: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tab.Screen
        name="PrayerFeed"
        component={PrayerFeedScreen}
        options={{
          title: 'Prayer Feed',
          tabBarLabel: 'Feed',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📿</Text>,
        }}
      />
      <Tab.Screen
        name="Campaigns"
        component={CampaignsScreen}
        options={{
          title: 'Campaigns',
          tabBarLabel: 'Campaigns',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await StateService.initialize();
        const subscribedCampaigns = StateService.getSubscribedCampaigns();
        // If user has subscribed campaigns, go to main tabs, otherwise to chooser
        setInitialRoute(subscribedCampaigns.length > 0 ? 'MainTabs' : 'CampaignChooser');
      } catch (error) {
        console.error('Error initializing app:', error);
        setInitialRoute('CampaignChooser');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading || !initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute as keyof RootStackParamList}
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CampaignChooser"
          component={CampaignChooserScreen}
          options={{ title: 'Choose Campaign' }}
        />
        <Stack.Screen
          name="PrayerFuel"
          component={PrayerFuelScreen}
          options={{ title: 'Prayer Fuel' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
});

export default AppNavigator;

