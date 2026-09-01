import { Text, View } from 'react-native';

import { transactionStyles } from '@/styles/transactions';

type TransactionItemProps = {
  type: 'income' | 'expense';
  amount: number;
  note: string | null;
  date: string;
  walletName: string;
};

export function TransactionItem({
  type,
  amount,
  note,
  date,
  walletName,
}: TransactionItemProps) {
  const isIncome = type === 'income';

  return (
    <View style={transactionStyles.transactionCard}>
      <View style={transactionStyles.transactionLeft}>
        <Text style={transactionStyles.transactionNote}>
          {note || 'ไม่มีรายละเอียด'}
        </Text>

        <Text style={transactionStyles.transactionDate}>
          {date}
        </Text>
      </View>

      <View style={transactionStyles.transactionRight}>
        <Text
          style={
            isIncome
              ? transactionStyles.transactionIncome
              : transactionStyles.transactionExpense
          }
        >
          {isIncome ? '+' : '-'}฿
          {amount.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
          })}
        </Text>

        <Text style={transactionStyles.transactionWallet}>
          {walletName}
        </Text>
      </View>
    </View>
  );
}