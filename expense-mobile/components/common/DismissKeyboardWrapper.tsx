import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';
import type { PropsWithChildren, ReactElement } from 'react';

type DismissKeyboardWrapperProps = PropsWithChildren<{
  children: ReactElement;
}>;

/**
 * ใช้แทน <TouchableWithoutFeedback onPress={Keyboard.dismiss}> ตรงๆ
 * บน iOS/Android ทำงานเหมือนเดิมทุกอย่าง (แตะนอกช่อง input แล้วปิดคีย์บอร์ด)
 *
 * แต่บนเว็บ react-native-web มีปัญหาที่รู้กันดีคือ TouchableWithoutFeedback ที่ครอบ
 * ScrollView/TextInput ไว้จะไปขวางไม่ให้คลิก/โฟกัสช่อง input ข้างในได้ (บั๊ก "กดช่อง
 * input แล้วพิมพ์ไม่ได้") จึงข้าม wrapper นี้ไปเลยบนเว็บ — ไม่จำเป็นต้องมีด้วย เพราะ
 * เบราว์เซอร์จัดการ blur ช่อง input เวลาคลิกที่อื่นให้อัตโนมัติอยู่แล้ว
 */
export function DismissKeyboardWrapper({
  children,
}: DismissKeyboardWrapperProps) {
  if (Platform.OS === 'web') {
    return children;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );
}
