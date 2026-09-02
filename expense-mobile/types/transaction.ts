export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  wallet_id: number;
  wallet_name: string;
  wallet_currency_code: string;
  category_id: number | null;
  category_name_key: string | null;
  category_icon: string | null;
  category_color: string | null;
  type: TransactionType;
  amount: number;
  note: string | null;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionSummary {
  currency_code: string;
  income: number;
  expense: number;
  balance: number;
}