import { Text, View } from 'react-native';

import { transactionStyles } from '@/styles/transactions';
import { useSettings } from '@/contexts/SettingsContext';
import { formatAmount } from '@/utils/currency';

type TransactionSummaryProps = {
  income: number;
  expense: number;
  currencyCode?: string;
};

export function TransactionSummary({
  income,
  expense,
  currencyCode = 'THB',
}: TransactionSummaryProps) {
  const { t, language } = useSettings();

  return (
    <View style={transactionStyles.summaryContainer}>
      <View style={transactionStyles.summaryCard}>
        <Text style={transactionStyles.summaryLabel}>
          {t.transactions.income}
        </Text>

        <Text style={transactionStyles.income}>
          +{formatAmount(income, currencyCode, language)}
        </Text>
      </View>

      <View style={transactionStyles.summaryCard}>
        <Text style={transactionStyles.summaryLabel}>
          {t.transactions.expense}
        </Text>

        <Text style={transactionStyles.expense}>
          -{formatAmount(expense, currencyCode, language)}
        </Text>
      </View>
    </View>
  );
}
