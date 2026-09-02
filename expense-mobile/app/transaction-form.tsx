import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { formStyles } from '@/styles/forms';
import { useSettings } from '@/contexts/SettingsContext';

import { SelectField } from '@/components/common/SelectField';
import { DateField } from '@/components/common/DateField';

import { getActiveWallets } from '@/database/table/wallets/queries';
import { getCategoriesByType } from '@/database/table/categories/queries';
import {
  createTransaction,
  deleteTransaction,
  getTransactionById,
  updateTransaction,
} from '@/database/table/transactions/queries';

import type { WalletWithBalance } from '@/database/table/wallets/queries';
import type { Category } from '@/types/category';
import type { TransactionType } from '@/types/transaction';

import { resolveCategoryIcon, getCategoryLabel } from '@/constants/categories';
import { toDateKey } from '@/utils/date';

export default function TransactionFormScreen() {
  const { t } = useSettings();
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    type?: string;
    walletId?: string;
  }>();

  const editingId = params.id ? Number(params.id) : null;
  const isEditing = editingId !== null;

  const [type, setType] = useState<TransactionType>(
    params.type === 'income' ? 'income' : 'expense'
  );
  const [amountText, setAmountText] = useState('');
  const [walletId, setWalletId] = useState<string | null>(
    params.walletId ?? null
  );
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(toDateKey(new Date()));

  const [wallets, setWallets] = useState<WalletWithBalance[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOptions = useCallback(async () => {
    try {
      const [walletList, categoryList] = await Promise.all([
        getActiveWallets(),
        getCategoriesByType(type),
      ]);

      setWallets(walletList);
      setCategories(categoryList);

      if (!walletId && walletList.length > 0 && !isEditing) {
        setWalletId(String(walletList[0].id));
      }
    } catch (err) {
      console.error('Failed to load form options:', err);
    }
  }, [type, isEditing]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  useEffect(() => {
    async function loadExisting() {
      if (!editingId) {
        setLoading(false);
        return;
      }

      try {
        const existing = await getTransactionById(editingId);

        if (existing) {
          setType(existing.type);
          setAmountText(String(existing.amount));
          setWalletId(String(existing.wallet_id));
          setCategoryId(
            existing.category_id ? String(existing.category_id) : null
          );
          setNote(existing.note ?? '');
          setDate(existing.transaction_date);
        }
      } catch (err) {
        console.error('Failed to load transaction:', err);
      } finally {
        setLoading(false);
      }
    }

    loadExisting();
  }, [editingId]);

  // ล้างหมวดหมู่ที่เลือกไว้เมื่อสลับประเภท ถ้าหมวดหมู่นั้นไม่อยู่ในลิสต์ใหม่
  useEffect(() => {
    if (categoryId && !categories.some((c) => String(c.id) === categoryId)) {
      setCategoryId(null);
    }
  }, [categories, categoryId]);

  const walletOptions = wallets.map((w) => ({
    id: String(w.id),
    label: w.name,
    subtitle: w.currency_code,
    icon: 'wallet-outline' as const,
    color: '#2563EB',
  }));

  const categoryOptions = categories.map((c) => ({
    id: String(c.id),
    label: getCategoryLabel(c.name_key, t, t.transactions.uncategorized),
    icon: resolveCategoryIcon(c.icon, c.type),
    color: c.color,
  }));

  const handleSave = async () => {
    Keyboard.dismiss();

    const amount = parseFloat(amountText.replace(',', '.'));

    if (!amount || amount <= 0 || Number.isNaN(amount)) {
      setError(t.transactions.amountRequired);
      return;
    }

    if (!walletId) {
      setError(t.transactions.walletRequired);
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const payload = {
        wallet_id: Number(walletId),
        category_id: categoryId ? Number(categoryId) : null,
        type,
        amount,
        note: note.trim() || null,
        transaction_date: date,
      };

      if (isEditing && editingId) {
        await updateTransaction(editingId, payload);
      } else {
        await createTransaction(payload);
      }

      router.back();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editingId) return;

    Alert.alert(
      t.common.deleteConfirmTitle,
      t.transactions.deleteConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(editingId);
              router.back();
            } catch (err) {
              console.error('Failed to delete transaction:', err);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return <View style={formStyles.screen} />;
  }

  const isIncome = type === 'income';

  return (
    <BottomSheetModalProvider>
    <KeyboardAvoidingView
      style={formStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              {isEditing
                ? t.transactions.editTransaction
                : t.transactions.addTransaction}
            </Text>

            <Pressable onPress={handleSave} disabled={saving}>
              <Text style={formStyles.headerButton}>{t.common.save}</Text>
            </Pressable>
          </View>

          <View style={formStyles.typeToggle}>
            <Pressable
              onPress={() => setType('expense')}
              style={[
                formStyles.typeToggleOption,
                !isIncome && formStyles.typeToggleOptionActiveExpense,
              ]}
            >
              <Text
                style={[
                  formStyles.typeToggleText,
                  !isIncome && formStyles.typeToggleTextActiveExpense,
                ]}
              >
                {t.transactions.typeExpense}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setType('income')}
              style={[
                formStyles.typeToggleOption,
                isIncome && formStyles.typeToggleOptionActiveIncome,
              ]}
            >
              <Text
                style={[
                  formStyles.typeToggleText,
                  isIncome && formStyles.typeToggleTextActiveIncome,
                ]}
              >
                {t.transactions.typeIncome}
              </Text>
            </Pressable>
          </View>

          <View style={formStyles.amountInputWrap}>
            <TextInput
              value={amountText}
              onChangeText={(text) => {
                setAmountText(text.replace(/[^0-9.]/g, ''));
                setError(null);
              }}
              placeholder="0.00"
              placeholderTextColor="#D1D5DB"
              keyboardType="decimal-pad"
              style={[
                formStyles.amountInput,
                { color: isIncome ? '#16A34A' : '#DC2626' },
              ]}
              autoFocus={!isEditing}
            />

            <Text style={formStyles.amountCurrency}>
              {t.transactions.amount}
            </Text>
          </View>

          {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

          <SelectField
            label={t.transactions.wallet}
            placeholder={t.transactions.selectWallet}
            options={walletOptions}
            selectedId={walletId}
            onSelect={setWalletId}
            sheetTitle={t.transactions.selectWallet}
          />

          <SelectField
            label={t.transactions.category}
            placeholder={t.transactions.selectCategory}
            options={categoryOptions}
            selectedId={categoryId}
            onSelect={setCategoryId}
            sheetTitle={t.transactions.selectCategory}
          />

          <DateField
            label={t.transactions.date}
            value={date}
            onChange={setDate}
          />

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.transactions.note}</Text>

            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder={t.transactions.notePlaceholder}
              placeholderTextColor="#9CA3AF"
              style={[formStyles.textInput, formStyles.textArea]}
              multiline
            />
          </View>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            style={[
              formStyles.primaryButton,
              isIncome
                ? formStyles.primaryButtonIncome
                : formStyles.primaryButtonExpense,
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}