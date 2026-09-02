import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { transactionStyles } from '@/styles/transactions';
import { useSettings } from '@/contexts/SettingsContext';
import { formatAmount } from '@/utils/currency';
import {
  getCategoryLabel,
  resolveCategoryIcon,
} from '@/constants/categories';
import type { Transaction } from '@/types/transaction';

type TransactionItemProps = {
  transaction: Transaction;
  onPress?: () => void;
  onLongPress?: () => void;
  onDelete?: () => void;
};

export function TransactionItem({
  transaction,
  onPress,
  onLongPress,
  onDelete,
}: TransactionItemProps) {
  const { t, language } = useSettings();
  const isIncome = transaction.type === 'income';

  const card = (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[transactionStyles.transactionCard, { marginBottom: 0 }]}
    >
      <View
        style={[
          transactionStyles.transactionIconBadge,
          {
            backgroundColor:
              (transaction.category_color ?? '#9CA3AF') + '22',
          },
        ]}
      >
        <Ionicons
          name={resolveCategoryIcon(
            transaction.category_icon,
            transaction.type
          )}
          size={18}
          color={transaction.category_color ?? '#6B7280'}
        />
      </View>

      <View style={transactionStyles.transactionLeft}>
        <Text style={transactionStyles.transactionNote}>
          {transaction.note ||
            getCategoryLabel(
              transaction.category_name_key,
              t,
              t.transactions.uncategorized
            )}
        </Text>

        <Text style={transactionStyles.transactionDate}>
          {getCategoryLabel(
            transaction.category_name_key,
            t,
            t.transactions.uncategorized
          )}
          {'  ·  '}
          {transaction.transaction_date}
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
          {isIncome ? '+' : '-'}
          {formatAmount(
            transaction.amount,
            transaction.wallet_currency_code,
            language
          )}
        </Text>

        <Text style={transactionStyles.transactionWallet}>
          {transaction.wallet_name}
        </Text>
      </View>
    </Pressable>
  );

  if (!onDelete) {
    return <View style={{ marginBottom: 10 }}>{card}</View>;
  }

  return (
    <Swipeable
      containerStyle={{ marginBottom: 10 }}
      overshootRight={false}
      rightThreshold={40}
      renderRightActions={() => (
        <Pressable
          onPress={onDelete}
          style={transactionStyles.swipeDeleteAction}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          
        </Pressable>
      )}
    >
      {card}
    </Swipeable>
  );
}