export interface Transfer {
  id: number;
  from_wallet_id: number;
  to_wallet_id: number;
  from_amount: number;
  to_amount: number;
  from_currency_code: string;
  to_currency_code: string;
  exchange_rate: number;
  note: string | null;
  transfer_date: string;
  created_at: string;
}