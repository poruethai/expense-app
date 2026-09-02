import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useSettings } from '@/contexts/SettingsContext';
import { MonthYearPicker } from '@/components/common/MonthYearPicker';
import { DonutChart } from '@/components/common/DonutChart';
import { formatAmount } from '@/utils/currency';
import { reportsStyles as styles } from '@/styles/reports';
import {
  CATEGORY_COLORS,
  getCategoryLabel,
  resolveCategoryIcon,
} from '@/constants/categories';

import {
  getCategoryBreakdown,
  getMonthlySummary,
  type CategoryBreakdownItem,
  type MonthlySummary,
} from '@/database/table/transactions/queries';
import type { TransactionType } from '@/types/transaction';

const FALLBACK_COLORS = CATEGORY_COLORS;

export default function ReportsScreen() {
  const { t, language } = useSettings();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState<TransactionType>('expense');

  const [monthly, setMonthly] = useState<MonthlySummary[]>([]);
  const [breakdown, setBreakdown] = useState<CategoryBreakdownItem[]>([]);

  const load = useCallback(async () => {
    try {
      const [monthlyData, breakdownData] = await Promise.all([
        getMonthlySummary(selectedYear, selectedMonth),
        getCategoryBreakdown(selectedYear, selectedMonth, viewType),
      ]);

      setMonthly(monthlyData);
      setBreakdown(breakdownData);
    } catch (error) {
      console.error('Failed to load report data:', error);
    }
  }, [selectedMonth, selectedYear, viewType]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const current = monthly[0] ?? {
    currency_code: 'THB',
    income: 0,
    expense: 0,
  };

  const balance = current.income - current.expense;
  const breakdownTotal = breakdown.reduce((sum, item) => sum + item.total, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}
    >
      <Text style={styles.title}>{t.reports.title}</Text>

      <MonthYearPicker
        month={selectedMonth}
        year={selectedYear}
        onChange={(month, year) => {
          setSelectedMonth(month);
          setSelectedYear(year);
        }}
      />

      <View style={styles.card}>
        <Text style={styles.label}>{t.reports.income}</Text>
        <Text style={styles.income}>
          +{formatAmount(current.income, current.currency_code, language)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t.reports.expense}</Text>
        <Text style={styles.expense}>
          -{formatAmount(current.expense, current.currency_code, language)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t.reports.balance}</Text>
        <Text style={styles.balance}>
          {formatAmount(balance, current.currency_code, language)}
        </Text>
      </View>

      <View style={styles.tabRow}>
        <Pressable
          onPress={() => setViewType('expense')}
          style={[styles.tab, viewType === 'expense' && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              viewType === 'expense' && styles.tabTextActive,
            ]}
          >
            {t.reports.viewExpense}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setViewType('income')}
          style={[styles.tab, viewType === 'income' && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              viewType === 'income' && styles.tabTextActive,
            ]}
          >
            {t.reports.viewIncome}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>
        {viewType === 'expense'
          ? t.reports.expenseByCategory
          : t.reports.incomeByCategory}
      </Text>

      {breakdown.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t.reports.noData}</Text>
        </View>
      ) : (
        <View style={styles.breakdownCard}>
          <DonutChart
            data={breakdown.map((item, index) => ({
              key: String(item.category_id ?? `uncategorized-${index}`),
              value: item.total,
              color: item.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
            }))}
            centerValue={formatAmount(
              breakdownTotal,
              current.currency_code,
              language
            )}
            centerLabel={
              viewType === 'expense'
                ? t.reports.viewExpense
                : t.reports.viewIncome
            }
          />

          <View style={styles.legend}>
            {breakdown.map((item, index) => {
              const percentage =
                breakdownTotal > 0 ? (item.total / breakdownTotal) * 100 : 0;
              const color =
                item.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];

              return (
                <View
                  key={item.category_id ?? `uncategorized-${index}`}
                  style={styles.legendRow}
                >
                  <View style={[styles.legendDot, { backgroundColor: color }]} />

                  <View style={styles.legendIconBadge}>
                    <Ionicons
                      name={resolveCategoryIcon(item.icon, viewType)}
                      size={14}
                      color={color}
                    />
                  </View>

                  <Text style={styles.legendLabel} numberOfLines={1}>
                    {getCategoryLabel(
                      item.name_key,
                      t,
                      t.transactions.uncategorized
                    )}
                  </Text>

                  <Text style={styles.legendPercent}>
                    {percentage.toFixed(1)}%
                  </Text>

                  <Text style={styles.legendAmount}>
                    {formatAmount(
                      item.total,
                      current.currency_code,
                      language
                    )}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}