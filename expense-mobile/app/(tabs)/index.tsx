import { Text, View } from 'react-native';
import { useState } from 'react';

import { BalanceCard } from '@/components/transactions/BalanceCard';
import { TransactionSummary } from '@/components/transactions/TransactionSummary';
import { TransactionList } from '@/components/transactions/TransactionList';
import { MonthYearPicker } from '@/components/transactions/MonthYearPicker';

import { useTransactions } from '@/hooks/useTransactions';

import { transactionStyles } from '@/styles/transactions';

export default function HomeScreen() {
  const {
    transactions,
    summary,
    refreshing,
    refresh,
  } = useTransactions();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const currentSummary = summary[0] ?? {
    currency_code: 'THB',
    balance: 0,
    income: 0,
    expense: 0,
  };

  return (
    <View style={transactionStyles.container}>
      <TransactionList
        transactions={transactions}
        refreshing={refreshing}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={transactionStyles.header}>
            <Text style={transactionStyles.title}>
              ภาพรวม
            </Text>

            <MonthYearPicker
              month={selectedMonth}
              year={selectedYear}
              onChange={(month, year) => {
                setSelectedMonth(month);
                setSelectedYear(year);
              }}
            />

            <BalanceCard
              balance={currentSummary.balance}
            />

            <TransactionSummary
              income={currentSummary.income}
              expense={currentSummary.expense}
            />

            <Text style={transactionStyles.sectionTitle}>
              รายการล่าสุด
            </Text>
          </View>
        }
        contentContainerStyle={
          transactionStyles.listContent
        }
      />
    </View>
  );
}