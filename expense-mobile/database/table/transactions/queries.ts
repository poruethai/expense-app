import { getDatabase } from '@/database/database';
import type { Transaction } from '@/types/transaction';

export async function getTransactions(): Promise<Transaction[]> {
  const db = await getDatabase();

  return db.getAllAsync<Transaction>(`
    SELECT
      t.id,
      t.wallet_id,
      w.name AS wallet_name,
      t.category_id,
      t.type,
      t.amount,
      t.note,
      t.transaction_date,
      t.created_at,
      t.updated_at
    FROM transactions t
    INNER JOIN wallets w
      ON w.id = t.wallet_id
    ORDER BY t.transaction_date DESC, t.id DESC
  `);
}

export async function getTransactionById(
  id: number
): Promise<Transaction | null> {
  const db = await getDatabase();

  return db.getFirstAsync<Transaction>(
    `
      SELECT
        t.id,
        t.wallet_id,
        w.name AS wallet_name,
        t.category_id,
        t.type,
        t.amount,
        t.note,
        t.transaction_date,
        t.created_at,
        t.updated_at
      FROM transactions t
      INNER JOIN wallets w
        ON w.id = t.wallet_id
      WHERE t.id = ?
    `,
    id
  );
}

export async function createTransaction(data: {
  wallet_id: number;
  category_id?: number | null;
  type: 'income' | 'expense';
  amount: number;
  note?: string | null;
  transaction_date: string;
}): Promise<number> {
  const db = await getDatabase();

  if (data.amount <= 0) {
    throw new Error('Transaction amount must be greater than 0');
  }

  const result = await db.runAsync(
    `
      INSERT INTO transactions (
        wallet_id,
        category_id,
        type,
        amount,
        note,
        transaction_date
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    data.wallet_id,
    data.category_id ?? null,
    data.type,
    data.amount,
    data.note ?? null,
    data.transaction_date
  );

  return result.lastInsertRowId;
}

export async function updateTransaction(
  id: number,
  data: {
    wallet_id: number;
    category_id?: number | null;
    type: 'income' | 'expense';
    amount: number;
    note?: string | null;
    transaction_date: string;
  }
): Promise<void> {
  const db = await getDatabase();

  if (data.amount <= 0) {
    throw new Error('Transaction amount must be greater than 0');
  }

  await db.runAsync(
    `
      UPDATE transactions
      SET
        wallet_id = ?,
        category_id = ?,
        type = ?,
        amount = ?,
        note = ?,
        transaction_date = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    data.wallet_id,
    data.category_id ?? null,
    data.type,
    data.amount,
    data.note ?? null,
    data.transaction_date,
    id
  );
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      DELETE FROM transactions
      WHERE id = ?
    `,
    id
  );
}

export type TransactionSummary = {
  currency_code: string;
  income: number;
  expense: number;
  balance: number;
};

export async function getTransactionSummary(): Promise<
  TransactionSummary[]
> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<{
    currency_code: string;
    income: number | null;
    expense: number | null;
    initial_balance: number | null;
    transfer_in: number | null;
    transfer_out: number | null;
  }>(`
    SELECT
      w.currency_code,

      COALESCE(
        (
          SELECT SUM(t.amount)
          FROM transactions t
          INNER JOIN wallets tw
            ON tw.id = t.wallet_id
          WHERE tw.currency_code = w.currency_code
            AND t.type = 'income'
        ),
        0
      ) AS income,

      COALESCE(
        (
          SELECT SUM(t.amount)
          FROM transactions t
          INNER JOIN wallets tw
            ON tw.id = t.wallet_id
          WHERE tw.currency_code = w.currency_code
            AND t.type = 'expense'
        ),
        0
      ) AS expense,

      COALESCE(
        (
          SELECT SUM(w2.initial_balance)
          FROM wallets w2
          WHERE w2.currency_code = w.currency_code
        ),
        0
      ) AS initial_balance,

      COALESCE(
        (
          SELECT SUM(tr.to_amount)
          FROM transfers tr
          INNER JOIN wallets tw
            ON tw.id = tr.to_wallet_id
          WHERE tw.currency_code = w.currency_code
        ),
        0
      ) AS transfer_in,

      COALESCE(
        (
          SELECT SUM(tr.from_amount)
          FROM transfers tr
          INNER JOIN wallets fw
            ON fw.id = tr.from_wallet_id
          WHERE fw.currency_code = w.currency_code
        ),
        0
      ) AS transfer_out

    FROM wallets w

    GROUP BY w.currency_code

    ORDER BY w.currency_code ASC
  `);

  return rows.map((row) => {
    const income = row.income ?? 0;
    const expense = row.expense ?? 0;
    const initialBalance = row.initial_balance ?? 0;
    const transferIn = row.transfer_in ?? 0;
    const transferOut = row.transfer_out ?? 0;

    return {
      currency_code: row.currency_code,
      income,
      expense,
      balance:
        initialBalance +
        income -
        expense +
        transferIn -
        transferOut,
    };
  });
}