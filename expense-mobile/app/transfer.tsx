import { useEffect, useState } from 'react';
import {
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
import { useRouter } from 'expo-router';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { formStyles } from '@/styles/forms';
import { useSettings } from '@/contexts/SettingsContext';

import { SelectField } from '@/components/common/SelectField';
import { DateField } from '@/components/common/DateField';

import {
  getActiveWallets,
  type WalletWithBalance,
} from '@/database/table/wallets/queries';
import { createTransfer } from '@/database/table/transfers/queries';
import { toDateKey } from '@/utils/date';

export default function TransferScreen() {
  const { t } = useSettings();
  const router = useRouter();

  const [wallets, setWallets] = useState<WalletWithBalance[]>([]);
  const [fromWalletId, setFromWalletId] = useState<string | null>(null);
  const [toWalletId, setToWalletId] = useState<string | null>(null);
  const [fromAmountText, setFromAmountText] = useState('');
  const [toAmountText, setToAmountText] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(toDateKey(new Date()));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await getActiveWallets();
        setWallets(list);

        if (list.length > 0) {
          setFromWalletId(String(list[0].id));
        }

        if (list.length > 1) {
          setToWalletId(String(list[1].id));
        }
      } catch (err) {
        console.error('Failed to load wallets for transfer:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const fromWallet = wallets.find((w) => String(w.id) === fromWalletId);
  const toWallet = wallets.find((w) => String(w.id) === toWalletId);
  const sameCurrency =
    fromWallet && toWallet && fromWallet.currency_code === toWallet.currency_code;

  const walletOptions = wallets.map((w) => ({
    id: String(w.id),
    label: w.name,
    subtitle: w.currency_code,
    icon: 'wallet-outline' as const,
    color: '#2563EB',
  }));

  const handleFromAmountChange = (text: string) => {
    const clean = text.replace(/[^0-9.]/g, '');
    setFromAmountText(clean);

    if (sameCurrency) {
      setToAmountText(clean);
    }
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!fromWalletId || !toWalletId) {
      setError(t.wallet.sameWalletError);
      return;
    }

    if (fromWalletId === toWalletId) {
      setError(t.wallet.sameWalletError);
      return;
    }

    const fromAmount = parseFloat(fromAmountText.replace(',', '.'));
    const toAmount = parseFloat(
      (sameCurrency ? fromAmountText : toAmountText).replace(',', '.')
    );

    if (!fromAmount || fromAmount <= 0 || !toAmount || toAmount <= 0) {
      setError(t.transactions.amountRequired);
      return;
    }

    if (!fromWallet || !toWallet) {
      setError(t.common.error);
      return;
    }

    setError(null);
    setSaving(true);

    try {
      await createTransfer({
        from_wallet_id: Number(fromWalletId),
        to_wallet_id: Number(toWalletId),
        from_amount: fromAmount,
        to_amount: toAmount,
        from_currency_code: fromWallet.currency_code,
        to_currency_code: toWallet.currency_code,
        exchange_rate: fromAmount > 0 ? toAmount / fromAmount : 1,
        note: note.trim() || null,
        transfer_date: date,
      });

      router.back();
    } catch (err) {
      console.error('Failed to save transfer:', err);
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
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

            <Text style={formStyles.headerTitle}>{t.wallet.transferTitle}</Text>

            <Pressable onPress={handleSave} disabled={saving}>
              <Text style={formStyles.headerButton}>{t.common.save}</Text>
            </Pressable>
          </View>

          {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

          <SelectField
            label={t.wallet.fromWallet}
            placeholder={t.transactions.selectWallet}
            options={walletOptions}
            selectedId={fromWalletId}
            onSelect={setFromWalletId}
            sheetTitle={t.wallet.fromWallet}
          />

          <SelectField
            label={t.wallet.toWallet}
            placeholder={t.transactions.selectWallet}
            options={walletOptions}
            selectedId={toWalletId}
            onSelect={setToWalletId}
            sheetTitle={t.wallet.toWallet}
          />

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.wallet.sendAmount}</Text>

            <TextInput
              value={fromAmountText}
              onChangeText={handleFromAmountChange}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
              style={formStyles.textInput}
            />
          </View>

          {!sameCurrency ? (
            <View style={formStyles.field}>
              <Text style={formStyles.label}>{t.wallet.receiveAmount}</Text>

              <TextInput
                value={toAmountText}
                onChangeText={(text) =>
                  setToAmountText(text.replace(/[^0-9.]/g, ''))
                }
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                style={formStyles.textInput}
              />

              <Text style={formStyles.helperText}>
                {fromWallet?.currency_code} → {toWallet?.currency_code}
              </Text>
            </View>
          ) : null}

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
              saving && formStyles.primaryButtonDisabled,
            ]}
          >
            <Text style={formStyles.primaryButtonText}>{t.common.save}</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </BottomSheetModalProvider>
  );
}