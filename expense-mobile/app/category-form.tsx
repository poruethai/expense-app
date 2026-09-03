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
import { Ionicons } from '@expo/vector-icons';

import { formStyles } from '@/styles/forms';
import { useSettings } from '@/contexts/SettingsContext';
import { showAlert } from '@/utils/alert';
import { DismissKeyboardWrapper } from '@/components/common/DismissKeyboardWrapper';

import {
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '@/database/table/categories/queries';

import type { CategoryType } from '@/types/category';
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  getCategoryLabel,
  resolveCategoryIcon,
} from '@/constants/categories';

export default function CategoryFormScreen() {
  const { t } = useSettings();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; type?: string }>();

  const editingId = params.id ? Number(params.id) : null;
  const isEditing = editingId !== null;

  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>(
    params.type === 'income' ? 'income' : 'expense'
  );
  const [icon, setIcon] = useState<string>(CATEGORY_ICONS[0]);
  const [color, setColor] = useState<string>(CATEGORY_COLORS[0]);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!editingId) {
        setLoading(false);
        return;
      }

      try {
        const existing = await getCategoryById(editingId);

        if (existing) {
          setName(getCategoryLabel(existing.name_key, t, ''));
          setType(existing.type);
          setIcon(resolveCategoryIcon(existing.icon, existing.type));
          setColor(existing.color ?? CATEGORY_COLORS[0]);
        }
      } catch (err) {
        console.error('Failed to load category:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!name.trim()) {
      setError(t.categories.nameRequired);
      return;
    }

    setError(null);
    setSaving(true);

    try {
      if (isEditing && editingId) {
        await updateCategory(editingId, {
          name_key: name.trim(),
          type,
          icon,
          color,
        });
      } else {
        await createCategory({
          name_key: name.trim(),
          type,
          icon,
          color,
        });
      }

      router.back();
    } catch (err) {
      console.error('Failed to save category:', err);
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editingId) return;

    showAlert(t.common.deleteConfirmTitle, t.categories.deleteConfirm, [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.common.delete,
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(editingId);
            router.back();
          } catch (err) {
            console.error('Failed to delete category:', err);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <View style={formStyles.screen} />;
  }

  const isIncome = type === 'income';

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
              {isEditing ? t.categories.editCategory : t.categories.addCategory}
            </Text>

            <Pressable onPress={handleSave} disabled={saving}>
              <Text style={formStyles.headerButton}>{t.common.save}</Text>
            </Pressable>
          </View>

          {error ? <Text style={formStyles.errorText}>{error}</Text> : null}

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
                {t.categories.expenseTab}
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
                {t.categories.incomeTab}
              </Text>
            </Pressable>
          </View>

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.categories.name}</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t.categories.namePlaceholder}
              placeholderTextColor="#9CA3AF"
              style={formStyles.textInput}
            />
          </View>

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.categories.color}</Text>

            <View style={formStyles.colorGrid}>
              {CATEGORY_COLORS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={[
                    formStyles.colorSwatch,
                    { backgroundColor: c },
                    c === color && formStyles.colorSwatchSelected,
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={formStyles.field}>
            <Text style={formStyles.label}>{t.categories.icon}</Text>

            <View style={formStyles.iconGrid}>
              {CATEGORY_ICONS.map((iconName) => {
                const isSelected = iconName === icon;

                return (
                  <Pressable
                    key={iconName}
                    onPress={() => setIcon(iconName)}
                    style={[
                      formStyles.iconSwatch,
                      isSelected && {
                        backgroundColor: color + '18',
                        borderColor: color,
                      },
                    ]}
                  >
                    <Ionicons name={iconName} size={20} color={color} />
                  </Pressable>
                );
              })}
            </View>
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
  );
}
