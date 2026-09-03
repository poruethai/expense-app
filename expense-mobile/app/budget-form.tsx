import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { formStyles } from '@/styles/forms';
import { useSettings } from '@/contexts/SettingsContext';
import { showAlert } from '@/utils/alert';

import { SelectField } from '@/components/common/SelectField';
import { DismissKeyboardWrapper } from '@/components/common/DismissKeyboardWrapper';

import { getActiveWallets } from '@/database/table/wallets/queries';
import { getCategoriesByType } from '@/database/table/categories/queries';
import {
  createBudget,
  deleteBudget,
  getBudgetById,
  updateBudget,
} from '@/database/table/budgets/queries';

import { getCategoryLabel, resolveCategoryIcon } from '@/constants/categories';

const ALL_WALLETS_ID = 'all';
const ALL_CATEGORIES_ID = 'all';

export default function BudgetFormScreen() {
  const { t } = useSettings();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const editingId = params.id ? Number(params.id) : null;
  const isEditing = editingId !== null;

  const [name, setName] = useState('');
  const [walletId, setWalletId] = useState<string>(ALL_WALLETS_ID);
  const [categoryId, setCategoryId] = useState<string>(ALL_CATEGORIES_ID);
  const [amountText, setAmountText] = useState('');

  const [wallets, setWallets] = useState<
    {
      id: number;
      name: string;
      currency_code: string;
      icon: string;
      color: string;
    }[]
  >([]);
  const [categories, setCategories] = useState<
    { id: number; name_key: string | null; icon: string | null; color: string | null }[]
  >([]);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [walletList, categoryList] = await Promise.all([
          getActiveWallets(),
          getCategoriesByType('expense'),
        ]);

        setWallets(walletList);
        setCategories(categoryList);

        if (editingId) {
          const existing = await getBudgetById(editingId);

          if (existing) {
            setName(existing.name);
            setWalletId(
              existing.wallet_id ? String(existing.wallet_id) : ALL_WALLETS_ID
            );
            setCategoryId(
              existing.category_id
                ? String(existing.category_id)
                : ALL_CATEGORIES_ID
            );
            setAmountText(String(existing.amount));
          }
        }
      } catch (err) {
        console.error('Failed to load budget form data:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [editingId]);

  const walletOptions = [
    {
      id: ALL_WALLETS_ID,
      label: t.budget.allWallets,
      icon: 'apps-outline' as any,
      color: '#6B7280',
    },
    ...wallets.map((w) => ({
      id: String(w.id),
      label: w.name,
      subtitle: w.currency_code,
      icon: (w.icon ?? 'wallet-outline') as any,
      color: w.color ?? '#2563EB',
    })),
  ];

  const categoryOptions = [
    {
      id: ALL_CATEGORIES_ID,
      label: t.budget.allCategories,
      icon: 'apps-outline' as const,
      color: '#6B7280',
    },
    ...categories.map((c) => ({
      id: String(c.id),
      label: getCategoryLabel(c.name_key, t, t.transactions.uncategorized),
      icon: resolveCategoryIcon(c.icon, 'expense'),
      color: c.color,
    })),
  ];

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!name.trim()) {
      setError(t.budget.nameRequired);
      return;
    }

    const amount = parseFloat(amountText.replace(',', '.'));

    if (!amount || amount <= 0 || Number.isNaN(amount)) {
      setError(t.budget.amountRequired);
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        wallet_id: walletId === ALL_WALLETS_ID ? null : Number(walletId),
        category_id:
          categoryId === ALL_CATEGORIES_ID ? null : Number(categoryId),
        amount,
      };

      if (isEditing && editingId) {
        await updateBudget(editingId, payload);
      } else {
        await createBudget(payload);
      }

      router.back();
    } catch (err) {
      console.error('Failed to save budget:', err);
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editingId) return;

    showAlert(t.common.deleteConfirmTitle, t.budget.deleteConfirm, [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.common.delete,
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBudget(editingId);
            router.back();
          } catch (err) {
            console.error('Failed to delete budget:', err);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <View style={formStyles.screen} />;
  }

  return (
    <KeyboardAvoidingView
      style={formStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <DismissKeyboardWrapper>
        <ScrollView
          contentContainerStyle={formStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={formStyles.headerRow}>
            <Pressable onPress={() => router.back()}>
              <Text style={formStyles.headerButtonMuted}>
                {t.common.cancel}
              </Text>
            </Pressable>

            <Text style={formStyles.headerTitle}>
              {isEditing ? t.budget.editBudget : t.budget.addBudget}
            </Text>

            <Pressable onPress={handleSave} disabled={saving}>
              <Text style={formStyles.headerButton}>{t.common.save}</Text>
            </Pressable>
          </View>

          {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.budget.name}</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t.budget.namePlaceholder}
              placeholderTextColor="#9CA3AF"
              style={formStyles.textInput}
            />
          </View>

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.budget.amount}</Text>

            <TextInput
              value={amountText}
              onChangeText={(text) =>
                setAmountText(text.replace(/[^0-9.]/g, ''))
              }
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              style={formStyles.textInput}
            />
          </View>

          <SelectField
            label={t.budget.wallet}
            placeholder={t.budget.allWallets}
            options={walletOptions}
            selectedId={walletId}
            onSelect={setWalletId}
            sheetTitle={t.budget.wallet}
          />

          <SelectField
            label={t.budget.category}
            placeholder={t.budget.allCategories}
            options={categoryOptions}
            selectedId={categoryId}
            onSelect={setCategoryId}
            sheetTitle={t.budget.category}
          />

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={[
              formStyles.primaryButton,
              saving && formStyles.primaryButtonDisabled,
            ]}
          >
            <Text style={formStyles.primaryButtonText}>{t.common.save}</Text>
          </Pressable>

          {isEditing ? (
            <Pressable onPress={handleDelete} style={formStyles.dangerButton}>
              <Text style={formStyles.dangerButtonText}>
                {t.common.delete}
              </Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </DismissKeyboardWrapper>
    </KeyboardAvoidingView>
  );
}
