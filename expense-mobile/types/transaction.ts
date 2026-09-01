export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  wallet_id: number;
  wallet_name: string;
  category_id: number | null;
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