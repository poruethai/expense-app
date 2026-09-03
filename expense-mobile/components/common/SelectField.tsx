import { useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { formStyles } from '@/styles/forms';

export type SelectOption = {
  id: string;
  label: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  color?: string | null;
};

type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: SelectOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  sheetTitle: string;
  disabled?: boolean;
  // ให้ผู้ใช้กำหนดหน้าตาปุ่มเปิด picker เองได้ (เช่น ปุ่มไอคอนกลมเล็กๆ)
  // ถ้าไม่ใส่ จะใช้ช่อง input เต็มความกว้างพร้อม label แบบเดิม
  renderTrigger?: (props: {
    open: () => void;
    selected: SelectOption | null;
  }) => React.ReactNode;
};

export function SelectField({
  label,
  placeholder,
  options,
  selectedId,
  onSelect,
  sheetTitle,
  disabled,
  renderTrigger,
}: SelectFieldProps) {
  const [visible, setVisible] = useState(false);

  const selected = options.find((option) => option.id === selectedId) ?? null;

  const open = () => {
    if (disabled) return;
    setVisible(true);
  };

  const close = () => setVisible(false);

  const handleSelect = (id: string) => {
    onSelect(id);
    close();
  };

  const trigger = renderTrigger ? (
    renderTrigger({ open, selected })
  ) : (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>

      <Pressable
        onPress={open}
        style={[formStyles.selectInput, disabled && formStyles.disabledInput]}
      >
        {selected?.icon ? (
          <View
            style={[
              formStyles.selectIconBadge,
              { backgroundColor: (selected.color ?? '#9CA3AF') + '22' },
            ]}
          >
            <Ionicons
              name={selected.icon}
              size={16}
              color={selected.color ?? '#6B7280'}
            />
          </View>
        ) : null}

        <Text
          style={[
            formStyles.selectInputText,
            !selected && formStyles.selectPlaceholder,
          ]}
        >
          {selected ? selected.label : placeholder}
        </Text>

        <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
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
        <Pressable
          style={formStyles.modalBackdrop}
          onPress={close}
          testID="select-field-backdrop"
        >
          <Pressable style={formStyles.modalSheet} onPress={() => {}}>
            <View style={formStyles.modalHandle} />

            <View style={formStyles.sheetHeader}>
              <Text style={formStyles.sheetTitle}>{sheetTitle}</Text>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingBottom: 24,
                paddingHorizontal: 20,
              }}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedId;

                return (
                  <Pressable
                    onPress={() => handleSelect(item.id)}
                    style={[
                      formStyles.optionRow,
                      isSelected && formStyles.optionRowSelected,
                    ]}
                  >
                    {item.icon ? (
                      <View
                        style={[
                          formStyles.selectIconBadge,
                          {
                            backgroundColor:
                              (item.color ?? '#9CA3AF') + '22',
                          },
                        ]}
                      >
                        <Ionicons
                          name={item.icon}
                          size={16}
                          color={item.color ?? '#6B7280'}
                        />
                      </View>
                    ) : null}

                    <View style={{ flex: 1 }}>
                      <Text style={formStyles.optionLabel}>{item.label}</Text>

                      {item.subtitle ? (
                        <Text style={formStyles.optionSubtitle}>
                          {item.subtitle}
                        </Text>
                      ) : null}
                    </View>

                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#2563EB"
                      />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
