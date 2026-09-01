import { Text, View } from 'react-native';

import { transactionStyles } from '@/styles/transactions';

export function EmptyTransactions() {
  return (
    <View style={transactionStyles.emptyContainer}>
      <Text style={transactionStyles.emptyTitle}>
        ยังไม่มีรายการ
      </Text>

      <Text style={transactionStyles.emptyText}>
        เพิ่มรายรับหรือรายจ่ายเพื่อเริ่มต้น
      </Text>
    </View>
  );
}