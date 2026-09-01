import { FlatList } from 'react-native';

import type { Transaction } from '@/types/transaction';

import { TransactionItem } from './TransactionItem';
import { EmptyTransactions } from './EmptyTransactions';

type TransactionListProps = {
  transactions: Transaction[];
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: object;
};

export function TransactionList({
  transactions,
  refreshing = false,
  onRefresh,
  ListHeaderComponent,
  contentContainerStyle,
}: TransactionListProps) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id.toString()}

      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 100,
      }}
      
      renderItem={({ item }) => (
        <TransactionItem
          type={item.type}
          amount={item.amount}
          note={item.note}
          date={item.transaction_date}
          walletName={item.wallet_name}
        />
      )}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<EmptyTransactions />}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
}