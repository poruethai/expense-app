import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { showAlert } from '@/utils/alert';
import { useSettings } from '@/contexts/SettingsContext';
import { languages } from '@/i18n/config';
import type { Language } from '@/i18n/config';
import { migrateDatabase, resetDatabase } from '@/database';

export default function SettingsScreen() {
  const { t, language, setLanguage, reload } = useSettings();

  const handleReset = () => {
    showAlert(
      t.settings.resetConfirmTitle,
      t.settings.resetConfirmMessage,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.settings.resetData,
          style: 'destructive',
          onPress: async () => {
            try {
              await resetDatabase();
              await migrateDatabase({ includeDemoWallets: false });
              await reload();
              showAlert(t.common.success, t.settings.resetDone);
            } catch (error) {
              console.error('Failed to reset data:', error);
              showAlert(t.common.error, '');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.settings.title}</Text>

      <Text style={styles.sectionTitle}>{t.settings.language}</Text>
      <Text style={styles.sectionSubtitle}>{t.settings.languageSubtitle}</Text>

      <View style={styles.card}>
        {(Object.keys(languages) as Language[]).map((code, index) => (
          <Pressable
            key={code}
            onPress={() => setLanguage(code)}
            style={[
              styles.optionRow,
              index < Object.keys(languages).length - 1 && styles.optionBorder,
            ]}
          >
            <Text style={styles.optionLabel}>{languages[code]}</Text>

            {language === code ? (
              <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
            ) : (
              <View style={styles.radioEmpty} />
            )}
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{t.settings.dataManagement}</Text>

      <Pressable style={styles.dangerCard} onPress={handleReset}>
        <View>
          <Text style={styles.dangerTitle}>{t.settings.resetData}</Text>
          <Text style={styles.dangerSubtitle}>
            {t.settings.resetDataSubtitle}
          </Text>
        </View>

        <Ionicons name="trash-outline" size={20} color="#DC2626" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 32,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  radioEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  dangerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  dangerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    maxWidth: 260,
  },
});
