import { StyleSheet, Text, View } from 'react-native';

export function DrivePlaceholderScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>DRIVE: Winter Quest</Text>
        <Text style={styles.title}>Expo foundation ready</Text>
        <Text style={styles.body}>
          This app shell is ready for the next approved build step. Product workflows, Firebase, rewards, and verification are deliberately not implemented yet.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E1511',
    padding: 24,
  },
  card: {
    maxWidth: 420,
    gap: 14,
    borderRadius: 24,
    backgroundColor: '#F5F2E8',
    padding: 28,
  },
  eyebrow: {
    color: '#7A4F24',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#10241A',
    fontSize: 30,
    fontWeight: '800',
  },
  body: {
    color: '#2E3B32',
    fontSize: 16,
    lineHeight: 23,
  },
});
