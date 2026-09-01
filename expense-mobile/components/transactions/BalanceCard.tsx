import { Text, View } from 'react-native';

import { transactionStyles } from '@/styles/transactions';

import { getTranslations } from '@/i18n';

type BalanceCardProps = {
  balance: number;
};

export function BalanceCard({ balance }: BalanceCardProps) {
    const t = getTranslations('th');

  return (
    <View style={transactionStyles.balanceCard}>
      <Text style={transactionStyles.balanceLabel}>
        {t.transactions.balance}
      </Text>

      <Text style={transactionStyles.balance}>
        ฿
        {balance.toLocaleString('th-TH', {
          minimumFractionDigits: 2,
        })}
      </Text>
    </View>
  );
}