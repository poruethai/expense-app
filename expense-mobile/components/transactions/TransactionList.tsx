import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ReactElement } from 'react';

import type { FeedItem } from '@/hooks/useTransactions';
import type { Transaction } from '@/types/transaction';

import { useSettings } from '@/contexts/SettingsContext';
import { formatDayHeader } from '@/utils/date';
import { transactionStyles } from '@/styles/transactions';

import { TransactionItem } from './TransactionItem';
import { TransferItem } from './TransferItem';
import { EmptyTransactions } from './EmptyTransactions';

type TransactionListProps = {
  feed: FeedItem[];
  refreshing?: boolean;
  onRefresh?: () => void;
  onItemPress?: (transaction: Transaction) => void;
  onItemLongPress?: (transaction: Transaction) => void;
  onItemDelete?: (transaction: Transaction) => void;
  onTransferLongPress?: (transferId: number) => void;
  onTransferDelete?: (transferId: number) => void;
  ListHeaderComponent?: ReactElement;
  contentContainerStyle?: object;
  filtered?: boolean;
};

type Row =
  | { rowType: 'header'; key: string; date: string; count: number }
  | { rowType: 'item'; key: string; feedItem: FeedItem };

export function TransactionList({
  feed,
  refreshing = false,
  onRefresh,
  onItemPress,
  onItemLongPress,
  onItemDelete,
  onTransferLongPress,
  onTransferDelete,
  ListHeaderComponent,
  contentContainerStyle,
  filtered,
}: TransactionListProps) {
  const { t, language } = useSettings();

  // เก็บ "วันที่ที่ถูกยุบ" เท่านั้น — ค่าเริ่มต้นคือทุกวันเปิดอยู่ (เซ็ตว่าง = ไม่มีวันไหนถูกยุบ)
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(
    new Set()
  );

  const toggleDate = (date: string) => {
    setCollapsedDates((prev) => {
      const next = new Set(prev);

      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }

      return next;
    });
  };

  const rows = useMemo(() => {
    const groups: { date: string; items: FeedItem[] }[] = [];

    for (const item of feed) {
      const lastGroup = groups[groups.length - 1];

      if (lastGroup && lastGroup.date === item.date) {
        lastGroup.items.push(item);
      } else {
        groups.push({ date: item.date, items: [item] });
      }
    }

    const result: Row[] = [];

    for (const group of groups) {
      result.push({
        rowType: 'header',
        key: `h-${group.date}`,
        date: group.date,
        count: group.items.length,
      });

      if (!collapsedDates.has(group.date)) {
        for (const feedItem of group.items) {
          result.push({ rowType: 'item', key: feedItem.key, feedItem });
        }
      }
    }

    return result;
  }, [feed, collapsedDates]);

  return (
    <FlatList
      data={rows}
      keyExtractor={(row) => row.key}
      contentContainerStyle={
        contentContainerStyle ?? {
          paddingHorizontal: 20,
          paddingBottom: 100,
        }
      }
      renderItem={({ item: row }) => {
        if (row.rowType === 'header') {
          const isCollapsed = collapsedDates.has(row.date);

          return (
            <Pressable
              onPress={() => toggleDate(row.date)}
              style={transactionStyles.dayHeaderRow}
            >
              <View style={transactionStyles.dayHeaderLeft}>
                <Ionicons
                  name={isCollapsed ? 'chevron-forward' : 'chevron-down'}
                  size={14}
                  color="#9CA3AF"
                />

                <Text style={transactionStyles.dayHeaderText}>
                  {formatDayHeader(row.date, language, t)}
                </Text>
              </View>

              <Text style={transactionStyles.dayHeaderCount}>
                {row.count}
              </Text>
            </Pressable>
          );
        }

        const item = row.feedItem;

        if (item.kind === 'transfer') {
          return (
            <TransferItem
              transfer={item.transfer}
              onLongPress={() => onTransferLongPress?.(item.transfer.id)}
              onDelete={
                onTransferDelete
                  ? () => onTransferDelete(item.transfer.id)
                  : undefined
              }
            />
          );
        }

        return (
          <TransactionItem
            transaction={item.transaction}
            onPress={() => onItemPress?.(item.transaction)}
            onLongPress={() => onItemLongPress?.(item.transaction)}
            onDelete={
              onItemDelete ? () => onItemDelete(item.transaction) : undefined
            }
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