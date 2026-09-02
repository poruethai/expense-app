import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useSettings } from '@/contexts/SettingsContext';
import { FAB } from '@/components/common/FAB';
import { formatAmount } from '@/utils/currency';

import {
  getWallets,
  type WalletWithBalance,
} from '@/database/table/wallets/queries';

export default function WalletScreen() {
  const { t, language } = useSettings();
  const router = useRouter();

  const [wallets, setWallets] = useState<WalletWithBalance[]>([]);

  const loadWallets = useCallback(async () => {
    try {
      const rows = await getWallets();
      setWallets(rows);
    } catch (error) {
      console.error('Failed to load wallets:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWallets();
    }, [loadWallets])
  );

  const totalsByCurrency = wallets.reduce<Record<string, number>>(
    (acc, wallet) => {
      if (!wallet.is_active) return acc;
      acc[wallet.currency_code] =
        (acc[wallet.currency_code] ?? 0) + wallet.balance;
      return acc;
    },
    {}
  );

  const totalCurrencies = Object.keys(totalsByCurrency);
  const activeWallets = wallets.filter((w) => w.is_active);

  const handleAddWallet = () => {
    router.push('/wallet-form');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={wallets}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 60,
          paddingBottom: 110,
        }}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{t.wallet.title}</Text>

            <View style={styles.card}>
              <Text style={styles.label}>{t.wallet.total}</Text>

              {totalCurrencies.length === 0 ? (
                <Text style={styles.amount}>
                  {formatAmount(0, 'THB', language)}
                </Text>
              ) : (
                totalCurrencies.map((code) => (
                  <Text key={code} style={styles.amount}>
                    {formatAmount(totalsByCurrency[code], code, language)}
                  </Text>
                ))
              )}
            </View>

            <Pressable
              onPress={() => router.push('/transfer')}
              style={styles.transferButton}
              disabled={activeWallets.length < 2}
            >
              <Ionicons name="swap-horizontal" size={18} color="#2563EB" />

              <Text style={styles.transferButtonText}>
                {t.wallet.transfer}
              </Text>
            </Pressable>

            <Text style={styles.sectionTitle}>{t.wallet.myWallets}</Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>{t.wallet.empty}</Text>
            <Text style={styles.subtext}>{t.wallet.emptySubtitle}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/wallet-form',
                params: { id: String(item.id) },
              })
            }
            style={styles.walletRow}
          >
            <View style={styles.walletIcon}>
              <Ionicons name="wallet-outline" size={20} color="#2563EB" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.walletName}>
                {item.name}
                {!item.is_active ? `  ·  ${t.wallet.inactive}` : ''}
              </Text>
              <Text style={styles.walletCurrency}>{item.currency_code}</Text>
            </View>

            <Text style={styles.walletBalance}>
              {formatAmount(item.balance, item.currency_code, language)}
            </Text>
          </Pressable>
        )}
      />

      <FAB onPress={handleAddWallet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    color: '#111827',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  label: {
    color: '#666',
    marginBottom: 8,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  transferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 28,
  },
  transferButtonText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111827',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },
  subtext: {
    color: '#777',
  },
  walletRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  walletCurrency: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  walletBalance: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});
