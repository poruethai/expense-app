import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useSettings } from '@/contexts/SettingsContext';
import { FAB } from '@/components/common/FAB';

import {
  getCategories,
  setCategoryActive,
} from '@/database/table/categories/queries';

import type { Category, CategoryType } from '@/types/category';
import { getCategoryLabel, resolveCategoryIcon } from '@/constants/categories';

export default function CategoriesScreen() {
  const { t } = useSettings();
  const router = useRouter();

  const [type, setType] = useState<CategoryType>('expense');
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = useCallback(async () => {
    try {
      const rows = await getCategories();
      setCategories(rows.filter((c) => c.type === type));
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  }, [type]);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  const toggleActive = async (category: Category) => {
    try {
      await setCategoryActive(category.id, !category.is_active);
      loadCategories();
    } catch (error) {
      console.error('Failed to toggle category:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.categories.title}</Text>
      </View>

      <View style={styles.tabRow}>
        <Pressable
          onPress={() => setType('expense')}
          style={[styles.tab, type === 'expense' && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              type === 'expense' && styles.tabTextActive,
            ]}
          >
            {t.categories.expenseTab}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setType('income')}
          style={[styles.tab, type === 'income' && styles.tabActive]}
        >
          <Text
            style={[
              styles.tabText,
              type === 'income' && styles.tabTextActive,
            ]}
          >
            {t.categories.incomeTab}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t.categories.empty}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              style={styles.rowMain}
              onPress={() =>
                router.push({
                  pathname: '/category-form',
                  params: { id: String(item.id) },
                })
              }
            >
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: (item.color ?? '#9CA3AF') + '22' },
                ]}
              >
                <Ionicons
                  name={resolveCategoryIcon(item.icon, item.type)}
                  size={18}
                  color={item.color ?? '#6B7280'}
                />
              </View>

              <Text style={styles.rowLabel}>
                {getCategoryLabel(
                  item.name_key,
                  t,
                  t.transactions.uncategorized
                )}
              </Text>
            </Pressable>

            <Switch
              value={item.is_active}
              onValueChange={() => toggleActive(item)}
            />
          </View>
        )}
      />

      <FAB
        onPress={() =>
          router.push({ pathname: '/category-form', params: { type } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#EEF0F3',
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#111827',
  },
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  empty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginTop: 12,
  },
  emptyText: {
    color: '#9CA3AF',
  },
});
