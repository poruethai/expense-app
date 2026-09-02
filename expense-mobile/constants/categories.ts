import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

// รองรับ icon key รุ่นเก่าที่เก็บไว้ในฐานข้อมูล (seed) และ mapping ไปยังชื่อไอคอนจริงของ Ionicons
const LEGACY_ICON_MAP: Record<string, IoniconName> = {
  food: 'fast-food-outline',
  wallet: 'wallet-outline',
  coffee: 'cafe-outline',
  car: 'car-outline',
  'shopping-bag': 'bag-outline',
};

export const CATEGORY_ICONS: IoniconName[] = [
  'fast-food-outline',
  'cafe-outline',
  'restaurant-outline',
  'pizza-outline',
  'beer-outline',
  'car-outline',
  'bus-outline',
  'train-outline',
  'bicycle-outline',
  'airplane-outline',
  'bag-outline',
  'cart-outline',
  'home-outline',
  'bed-outline',
  'key-outline',
  'flash-outline',
  'flame-outline',
  'water-outline',
  'wifi-outline',
  'call-outline',
  'medkit-outline',
  'fitness-outline',
  'school-outline',
  'book-outline',
  'library-outline',
  'game-controller-outline',
  'film-outline',
  'musical-notes-outline',
  'camera-outline',
  'ticket-outline',
  'gift-outline',
  'paw-outline',
  'shirt-outline',
  'glasses-outline',
  'construct-outline',
  'card-outline',
  'wallet-outline',
  'cash-outline',
  'trending-up-outline',
  'briefcase-outline',
  'laptop-outline',
  'people-outline',
  'heart-outline',
  'star-outline',
  'umbrella-outline',
  'leaf-outline',
  'ellipsis-horizontal-outline',
];

export const CATEGORY_COLORS: string[] = [
  '#F97316',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#6366F1',
  '#3B82F6',
  '#0EA5E9',
  '#14B8A6',
  '#16A34A',
  '#84CC16',
  '#EAB308',
  '#78716C',
];

export function resolveCategoryIcon(
  icon: string | null | undefined,
  type: 'income' | 'expense' = 'expense'
): IoniconName {
  if (!icon) {
    return type === 'income' ? 'trending-up-outline' : 'ellipsis-horizontal-outline';
  }

  if (icon in LEGACY_ICON_MAP) {
    return LEGACY_ICON_MAP[icon];
  }

  return icon as IoniconName;
}

export function getCategoryLabel(
  nameKey: string | null | undefined,
  t: any,
  fallback: string
): string {
  if (!nameKey) {
    return fallback;
  }

  if (nameKey.startsWith('category.')) {
    const key = nameKey.slice('category.'.length);
    return t.category?.[key] ?? nameKey;
  }

  return nameKey;
}
