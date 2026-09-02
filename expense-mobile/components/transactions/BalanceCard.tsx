import { Text, View } from 'react-native';

import { transactionStyles } from '@/styles/transactions';
import { useSettings } from '@/contexts/SettingsContext';
import { formatAmount } from '@/utils/currency';

type BalanceCardProps = {
  balance: number;
  currencyCode?: string;
};

export function BalanceCard({
  balance,
  currencyCode = 'THB',
}: BalanceCardProps) {
  const { t, language } = useSettings();

  return (
    <View style={transactionStyles.balanceCard}>
      <Text style={transactionStyles.balanceLabel}>
        {t.transactions.balance}
      </Text>

      <Text style={transactionStyles.balance}>
        {formatAmount(balance, currencyCode, language)}
      </Text>
    </View>
  );
}
