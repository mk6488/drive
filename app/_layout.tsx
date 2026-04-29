import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { theme } from '@/src/constants/theme';
import { AuthProvider } from '@/src/services/auth/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
