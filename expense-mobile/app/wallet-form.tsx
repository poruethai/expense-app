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
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { formStyles } from '@/styles/forms';
import { useSettings } from '@/contexts/SettingsContext';
import { showAlert } from '@/utils/alert';

import { SelectField } from '@/components/common/SelectField';
import { DismissKeyboardWrapper } from '@/components/common/DismissKeyboardWrapper';

import { getActiveCurrencies } from '@/database/table/currencies/queries';
import {
  createWallet,
  deleteWallet,
  getWalletById,
  updateWallet,
} from '@/database/table/wallets/queries';

import type { Currency } from '@/types/currency';

export default function WalletFormScreen() {
  const { t } = useSettings();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const editingId = params.id ? Number(params.id) : null;
  const isEditing = editingId !== null;

  const [name, setName] = useState('');
  const [currencyCode, setCurrencyCode] = useState<string | null>('THB');
  const [initialBalanceText, setInitialBalanceText] = useState('0');
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const currencyList = await getActiveCurrencies();
        setCurrencies(currencyList);

        if (editingId) {
          const existing = await getWalletById(editingId);

          if (existing) {
            setName(existing.name);
            setCurrencyCode(existing.currency_code);
            setInitialBalanceText(String(existing.initial_balance));
          }
        } else if (currencyList.length > 0) {
          setCurrencyCode(currencyList[0].code);
        }
      } catch (err) {
        console.error('Failed to load wallet form data:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [editingId]);

  const currencyOptions = currencies.map((c) => {
    const currencyKey = c.name_key.startsWith('currency.')
      ? c.name_key.slice('currency.'.length)
      : null;

    const label =
      (currencyKey && (t.currency as Record<string, string>)[currencyKey]) ||
      c.code;

    return {
      id: c.code,
      label: `${c.symbol} · ${label}`,
      subtitle: c.code,
    };
  });

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!name.trim()) {
      setError(t.wallet.nameRequired);
      return;
    }

    if (!currencyCode) {
      setError(t.wallet.selectCurrency);
      return;
    }

    const initialBalance = parseFloat(
      initialBalanceText.replace(',', '.') || '0'
    );

    setError(null);
    setSaving(true);

    try {
      if (isEditing && editingId) {
        await updateWallet(editingId, {
          name: name.trim(),
          currency_code: currencyCode,
          initial_balance: Number.isNaN(initialBalance) ? 0 : initialBalance,
        });
      } else {
        await createWallet({
          name: name.trim(),
          currency_code: currencyCode,
          initial_balance: Number.isNaN(initialBalance) ? 0 : initialBalance,
        });
      }

      router.back();
    } catch (err) {
      console.error('Failed to save wallet:', err);
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editingId) return;

    showAlert(t.common.deleteConfirmTitle, t.wallet.deleteConfirm, [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.common.delete,
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteWallet(editingId);
            router.back();
          } catch (err) {
            console.error('Failed to delete wallet:', err);
            showAlert(t.common.error, t.wallet.deleteHasTransactions);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <View style={formStyles.screen} />;
  }

  return (
    <BottomSheetModalProvider>
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
              {isEditing ? t.wallet.editWallet : t.wallet.addWallet}
            </Text>

            <Pressable onPress={handleSave} disabled={saving}>
              <Text style={formStyles.headerButton}>{t.common.save}</Text>
            </Pressable>
          </View>

          {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.wallet.name}</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t.wallet.namePlaceholder}
              placeholderTextColor="#9CA3AF"
              style={formStyles.textInput}
            />
          </View>

          <SelectField
            label={t.wallet.currency}
            placeholder={t.wallet.selectCurrency}
            options={currencyOptions}
            selectedId={currencyCode}
            onSelect={setCurrencyCode}
            sheetTitle={t.wallet.selectCurrency}
            disabled={isEditing}
          />

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.wallet.initialBalance}</Text>

            <TextInput
              value={initialBalanceText}
              onChangeText={(text) =>
                setInitialBalanceText(text.replace(/[^0-9.]/g, ''))
              }
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              style={formStyles.textInput}
            />
          </View>

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
    </BottomSheetModalProvider>
  );
}
