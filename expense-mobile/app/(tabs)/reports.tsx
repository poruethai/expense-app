import { StyleSheet, Text, View } from 'react-native';

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายงาน</Text>

      <View style={styles.card}>
        <Text style={styles.label}>รายรับ</Text>
        <Text style={styles.income}>฿0.00</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>รายจ่าย</Text>
        <Text style={styles.expense}>฿0.00</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>คงเหลือ</Text>
        <Text style={styles.balance}>฿0.00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  label: {
    color: '#666',
    marginBottom: 8,
  },
  income: {
    fontSize: 26,
    fontWeight: '700',
  },
  expense: {
    fontSize: 26,
    fontWeight: '700',
  },
  balance: {
    fontSize: 26,
    fontWeight: '700',
  },
});