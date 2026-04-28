import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { theme } from '@/src/constants/theme';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colours.riverNight },
          headerTintColor: theme.colours.parchment,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: theme.colours.riverNight },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: 'DRIVE: Winter Quest' }} />
        <Stack.Screen name="athlete/index" options={{ title: 'Athlete Preview' }} />
        <Stack.Screen name="coach/index" options={{ title: 'Coach Preview' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
