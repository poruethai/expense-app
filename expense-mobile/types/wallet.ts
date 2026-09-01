export interface Wallet {
  id: number;
  name: string;
  currency_code: string;
  initial_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}