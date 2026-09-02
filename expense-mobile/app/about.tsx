import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { useSettings } from '@/contexts/SettingsContext';

export default function AboutScreen() {
  const { t } = useSettings();

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Ionicons name="wallet" size={40} color="#2563EB" />
      </View>

      <Text style={styles.appName}>{t.about.appName}</Text>
      <Text style={styles.version}>
        {t.about.version} {version}
      </Text>

      <View style={styles.card}>
        <Text style={styles.description}>{t.about.description}</Text>
      </View>

      <Text style={styles.footer}>{t.about.madeWith}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  version: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    fontSize: 12,
    color: '#9CA3AF',
  },
});
