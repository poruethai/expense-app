import { StyleSheet, Text, View } from 'react-native';

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ยอดรวมใน Wallet</Text>
        <Text style={styles.amount}>฿0.00</Text>
      </View>

      <Text style={styles.sectionTitle}>บัญชีของฉัน</Text>

      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>ยังไม่มี Wallet</Text>
        <Text style={styles.subtext}>เพิ่ม Wallet เพื่อจัดการเงินของคุณ</Text>
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
    marginBottom: 28,
  },
  label: {
    color: '#666',
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtext: {
    color: '#777',
  },
});