import { Alert, Platform } from 'react-native';

export type AlertButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

/**
 * ใช้แทน Alert.alert ของ react-native ตรงๆ — บน iOS/Android ทำงานเหมือนเดิมทุกอย่าง
 * แต่บนเว็บ react-native-web ไม่ implement Alert.alert จริง (เป็นฟังก์ชันเปล่า ไม่ทำอะไรเลย)
 * จึงสลับไปใช้ window.alert / window.confirm ของเบราว์เซอร์แทนเพื่อให้กดแล้วมีผลจริง
 *
 * ข้อจำกัดบนเว็บ: window.confirm รองรับแค่ 2 ปุ่ม (ตกลง/ยกเลิก) ถ้ามีมากกว่า 2 ปุ่ม
 * (เช่น ยกเลิก/แก้ไข/ลบ) จะจับคู่ปุ่ม "destructive" หรือปุ่มสุดท้ายเป็นฝั่งยืนยัน
 * และปุ่ม "cancel" เป็นฝั่งปฏิเสธ ส่วนตัวเลือกกลางๆ อื่นจะไม่แสดงบนเว็บ
 */
export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void {
  if (Platform.OS !== 'web') {
    Alert.alert(title, message, buttons);
    return;
  }

  const list = buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }];
  const fullMessage = [title, message].filter(Boolean).join('\n\n');

  if (list.length === 1) {
    window.alert(fullMessage);
    list[0].onPress?.();
    return;
  }

  const cancelButton = list.find((b) => b.style === 'cancel');
  const actionButton =
    list.find((b) => b.style === 'destructive') ??
    list.find((b) => b !== cancelButton) ??
    list[list.length - 1];

  const confirmed = window.confirm(fullMessage);

  if (confirmed) {
    actionButton?.onPress?.();
  } else {
    cancelButton?.onPress?.();
  }
}
