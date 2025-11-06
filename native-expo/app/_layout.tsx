import { Stack, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '@/state/store';

export default function RootLayout() {
  const loadState = useAppStore((state) => state.loadState);

  useEffect(() => {
    loadState();
  }, [loadState]);

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="choose" />
        <Stack.Screen name="fuel/[id]" />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}

