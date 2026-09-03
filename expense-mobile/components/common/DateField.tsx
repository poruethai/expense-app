import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { formStyles } from '@/styles/forms';
import { useSettings } from '@/contexts/SettingsContext';
import {
  daysInMonth,
  formatDisplayDate,
  fromDateKey,
  getMonthNames,
  toDateKey,
} from '@/utils/date';

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  // ให้กำหนดหน้าตาปุ่มเปิดปฏิทินเองได้ (เช่น ปุ่ม "TODAY" แบบ pill)
  // ถ้าไม่ใส่ จะใช้ช่อง input เต็มความกว้างพร้อม label แบบเดิม
  renderTrigger?: (props: { open: () => void; displayLabel: string }) => React.ReactNode;
};

export function DateField({ label, value, onChange, renderTrigger }: DateFieldProps) {
  const { language } = useSettings();
  const [visible, setVisible] = useState(false);

  const selectedDate = fromDateKey(value);

  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth() + 1);

  const months = getMonthNames(language);

  const open = () => {
    const current = fromDateKey(value);
    setViewYear(current.getFullYear());
    setViewMonth(current.getMonth() + 1);
    setVisible(true);
  };

  const close = () => setVisible(false);

  const goToPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDay = (day: number) => {
    const newDate = new Date(viewYear, viewMonth - 1, day);
    onChange(toDateKey(newDate));
    close();
  };

  const selectToday = () => {
    onChange(toDateKey(new Date()));
    close();
  };

  const total = daysInMonth(viewYear, viewMonth);
  const firstWeekday = new Date(viewYear, viewMonth - 1, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  const trigger = renderTrigger ? (
    renderTrigger({ open, displayLabel: formatDisplayDate(value, language) })
  ) : (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>

      <Pressable onPress={open} style={formStyles.selectInput}>
        <Ionicons name="calendar-outline" size={18} color="#6B7280" />

        <Text style={formStyles.selectInputText}>
          {formatDisplayDate(value, language)}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <>
      {trigger}

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={close}
        statusBarTranslucent
      >
        <Pressable style={formStyles.modalBackdrop} onPress={close}>
          <Pressable style={formStyles.modalSheet} onPress={() => {}}>
            <View style={formStyles.modalHandle} />

            <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <Pressable onPress={goToPrevMonth} style={{ padding: 8 }}>
                  <Ionicons name="chevron-back" size={22} color="#111827" />
                </Pressable>

                <Text
                  style={{ fontSize: 17, fontWeight: '700', color: '#111827' }}
                >
                  {months[viewMonth - 1]} {viewYear}
                </Text>

                <Pressable onPress={goToNextMonth} style={{ padding: 8 }}>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color="#111827"
                  />
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {(language === 'th'
                  ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
                  : ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                ).map((d, index) => (
                  <Text
                    key={`${d}-${index}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 12,
                      color: '#9CA3AF',
                      fontWeight: '600',
                    }}
                  >
                    {d}
                  </Text>
                ))}
              </View>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {cells.map((day, index) => {
                  const isSelected =
                    day !== null &&
                    viewYear === selectedDate.getFullYear() &&
                    viewMonth === selectedDate.getMonth() + 1 &&
                    day === selectedDate.getDate();

                  return (
                    <View
                      key={index}
                      style={{ width: `${100 / 7}%`, paddingVertical: 4 }}
                    >
                      {day !== null ? (
                        <Pressable
                          onPress={() => selectDay(day)}
                          style={{
                            aspectRatio: 1,
                            borderRadius: 999,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isSelected
                              ? '#2563EB'
                              : 'transparent',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: isSelected ? '700' : '500',
                              color: isSelected ? '#FFFFFF' : '#111827',
                            }}
                          >
                            {day}
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })}
              </View>

              <Pressable
                onPress={selectToday}
                style={{
                  marginTop: 16,
                  marginBottom: 8,
                  alignSelf: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 18,
                  borderRadius: 20,
                  backgroundColor: '#F3F4F6',
                }}
              >
                <Text style={{ fontWeight: '600', color: '#2563EB' }}>
                  {language === 'th' ? 'วันนี้' : 'Today'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
