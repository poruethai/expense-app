import { FlatList } from 'react-native';
import type { ReactElement } from 'react';

import type { FeedItem } from '@/hooks/useTransactions';
import type { Transaction } from '@/types/transaction';

import { TransactionItem } from './TransactionItem';
import { TransferItem } from './TransferItem';
import { EmptyTransactions } from './EmptyTransactions';

type TransactionListProps = {
  feed: FeedItem[];
  refreshing?: boolean;
  onRefresh?: () => void;
  onItemPress?: (transaction: Transaction) => void;
  onItemLongPress?: (transaction: Transaction) => void;
  onTransferLongPress?: (transferId: number) => void;
  ListHeaderComponent?: ReactElement;
  contentContainerStyle?: object;
  filtered?: boolean;
};

export function TransactionList({
  feed,
  refreshing = false,
  onRefresh,
  onItemPress,
  onItemLongPress,
  onTransferLongPress,
  ListHeaderComponent,
  contentContainerStyle,
  filtered,
}: TransactionListProps) {
  return (
    <FlatList
      data={feed}
      keyExtractor={(item) => item.key}
      contentContainerStyle={
        contentContainerStyle ?? {
          paddingHorizontal: 20,
          paddingBottom: 100,
        }
      }
      renderItem={({ item }) => {
        if (item.kind === 'transfer') {
          return (
            <TransferItem
              transfer={item.transfer}
              onLongPress={() => onTransferLongPress?.(item.transfer.id)}
            />
          );
        }

        return (
          <TransactionItem
            transaction={item.transaction}
            onPress={() => onItemPress?.(item.transaction)}
            onLongPress={() => onItemLongPress?.(item.transaction)}
          />
        );
      }}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={<EmptyTransactions filtered={filtered} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
}