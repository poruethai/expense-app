import { getCategoryLabel } from '@/constants/categories';
import type { BudgetWithSpent } from '@/types/budget';

export function getBudgetScopeLabel(
  budget: BudgetWithSpent,
  t: any
): string {
  const walletLabel = budget.wallet_id
    ? budget.wallet_name ?? t.transactions.uncategorized
    : t.budget.allWallets;

  const categoryLabel = budget.category_id
    ? getCategoryLabel(
        budget.category_name_key,
        t,
        t.transactions.uncategorized
      )
    : t.budget.allCategories;

  return `${walletLabel} ${t.budget.scopeSeparator} ${categoryLabel}`;
}

export function getBudgetProgress(spent: number, amount: number): number {
  if (amount <= 0) return 0;
  return Math.min(spent / amount, 1);
}

export function getBudgetColor(spent: number, amount: number): string {
  if (amount <= 0) return '#9CA3AF';

  const ratio = spent / amount;

  if (ratio >= 1) return '#DC2626'; // แดง — เกินวงเงิน
  if (ratio >= 0.8) return '#EAB308'; // เหลือง — ใกล้เกิน
  return '#16A34A'; // เขียว — ปกติ
}
