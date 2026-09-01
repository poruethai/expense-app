import { StyleSheet, Text, View } from 'react-native';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>เพิ่มเติม</Text>

      <View style={styles.menu}>
        <Text style={styles.menuText}>ตั้งค่า</Text>
      </View>

      <View style={styles.menu}>
        <Text style={styles.menuText}>หมวดหมู่</Text>
      </View>

      <View style={styles.menu}>
        <Text style={styles.menuText}>เกี่ยวกับแอป</Text>
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
  menu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});