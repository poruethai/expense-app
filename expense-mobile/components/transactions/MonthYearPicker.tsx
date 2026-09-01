import { useMemo, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import { transactionStyles } from '@/styles/transactions';

type MonthYearPickerProps = {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function MonthYearPicker({
  month,
  year,
  onChange,
}: MonthYearPickerProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['55%'], []);

  const openPicker = () => {
    bottomSheetRef.current?.present();
  };

  const closePicker = () => {
    bottomSheetRef.current?.dismiss();
  };

  const selectMonth = (selectedMonth: number) => {
    onChange(selectedMonth, year);
    closePicker();
  };

  const changeYear = (newYear: number) => {
    onChange(month, newYear);
  };

  return (
    <>
      <Pressable
        onPress={openPicker}
        style={transactionStyles.monthSelector}
      >
        <Text style={transactionStyles.monthSelectorText}>
          {MONTHS[month - 1]} {year}
        </Text>

        <Text style={transactionStyles.monthSelectorArrow}>
          ▼
        </Text>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetView
          style={transactionStyles.monthSheet}
        >
          <Text style={transactionStyles.monthSheetTitle}>
            เลือกช่วงเวลา
          </Text>

          <View style={transactionStyles.yearSelector}>
            <Pressable
              onPress={() => changeYear(year - 1)}
            >
              <Text style={transactionStyles.yearArrow}>
                ‹
              </Text>
            </Pressable>

            <Text style={transactionStyles.selectedYear}>
              {year}
            </Text>

            <Pressable
              onPress={() => changeYear(year + 1)}
            >
              <Text style={transactionStyles.yearArrow}>
                ›
              </Text>
            </Pressable>
          </View>

          <View style={transactionStyles.monthGrid}>
            {MONTHS.map((monthName, index) => {
              const selected = index + 1 === month;

              return (
                <Pressable
                  key={monthName}
                  onPress={() => selectMonth(index + 1)}
                  style={[
                    transactionStyles.monthItem,
                    selected &&
                      transactionStyles.monthItemSelected,
                  ]}
                >
                  <Text
                    style={[
                      transactionStyles.monthItemText,
                      selected &&
                        transactionStyles.monthItemTextSelected,
                    ]}
                  >
                    {monthName}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}