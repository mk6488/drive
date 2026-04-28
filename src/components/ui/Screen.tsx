import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '@/src/constants/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  centred?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, scroll = true, centred = false, style, contentStyle }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.content, centred && styles.centred, contentStyle]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, centred && styles.centred, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colours.riverNight,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: theme.spacing.xl,
    padding: theme.spacing.xl,
  },
  centred: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
