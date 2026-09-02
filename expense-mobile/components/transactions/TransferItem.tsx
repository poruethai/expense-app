import { Pressable, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import { transactionStyles } from '@/styles/transactions';
import { useSettings } from '@/contexts/SettingsContext';
import { formatAmount } from '@/utils/currency';
import type { TransferWithWallets } from '@/database/table/transfers/queries';

type TransferItemProps = {
  transfer: TransferWithWallets;
  onLongPress?: () => void;
  onDelete?: () => void;
};

export function TransferItem({
  transfer,
  onLongPress,
  onDelete,
}: TransferItemProps) {
  const { t, language } = useSettings();

  const card = (
    <Pressable
      onLongPress={onLongPress}
      style={[transactionStyles.transactionCard, { marginBottom: 0 }]}
    >
      <View
        style={[
          transactionStyles.transactionIconBadge,
          { backgroundColor: '#E5E7EB' },
        ]}
      >
        <Ionicons name="swap-horizontal" size={18} color="#111827" />
      </View>

      <View style={transactionStyles.transactionLeft}>
        <Text style={[transactionStyles.transactionNote, { color: '#111827' }]}>
          {t.wallet.transferTitle}
        </Text>

        <Text style={transactionStyles.transactionDate}>
          {transfer.from_wallet_name} → {transfer.to_wallet_name}
          {'  ·  '}
          {transfer.transfer_date}
        </Text>
      </View>

      <View style={transactionStyles.transactionRight}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>
          {formatAmount(
            transfer.from_amount,
            transfer.from_currency_code,
            language
          )}
        </Text>

        <Text style={transactionStyles.transactionWallet}>
          {transfer.from_wallet_name}
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