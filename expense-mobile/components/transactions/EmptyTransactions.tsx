import { Text, View } from 'react-native';

import { transactionStyles } from '@/styles/transactions';
import { useSettings } from '@/contexts/SettingsContext';

type EmptyTransactionsProps = {
  filtered?: boolean;
};

export function EmptyTransactions({ filtered }: EmptyTransactionsProps) {
  const { t } = useSettings();

  return (
    <View style={transactionStyles.emptyContainer}>
      <Text style={transactionStyles.emptyTitle}>
        {filtered ? t.transactions.emptyFiltered : t.transactions.empty}
      </Text>

      {!filtered ? (
        <Text style={transactionStyles.emptyText}>
          {t.transactions.emptySubtitle}
        </Text>
      ) : null}
    </View>
  );
}
