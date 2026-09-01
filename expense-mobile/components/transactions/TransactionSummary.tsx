import { Text, View } from 'react-native';

import { transactionStyles } from '@/styles/transactions';

type TransactionSummaryProps = {
  income: number;
  expense: number;
};

export function TransactionSummary({
  income,
  expense,
}: TransactionSummaryProps) {
  return (
    <View style={transactionStyles.summaryContainer}>
      <View style={transactionStyles.summaryCard}>
        <Text style={transactionStyles.summaryLabel}>
          รายรับ
        </Text>

        <Text style={transactionStyles.income}>
          +฿
          {income.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
          })}
        </Text>
      </View>

      <View style={transactionStyles.summaryCard}>
        <Text style={transactionStyles.summaryLabel}>
          รายจ่าย
        </Text>

        <Text style={transactionStyles.expense}>
          -฿
          {expense.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
          })}
        </Text>
      </View>
    </View>
  );
}