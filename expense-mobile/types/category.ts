export type CategoryType = 'income' | 'expense';

export interface Category {
  id: number;
  name_key: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  is_active: boolean;
  created_at: string;
}