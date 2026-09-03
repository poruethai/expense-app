import { getDatabase } from '@/database/database';
import type { Transaction, TransactionType } from '@/types/transaction';

const SELECT_TRANSACTION = `
  SELECT
    t.id,
    t.wallet_id,
    w.name AS wallet_name,
    w.currency_code AS wallet_currency_code,
    t.category_id,
    c.name_key AS category_name_key,
    c.icon AS category_icon,
    c.color AS category_color,
    t.type,
    t.amount,
    t.note,
    t.transaction_date,
    t.created_at,
    t.updated_at
  FROM transactions t
  INNER JOIN wallets w
    ON w.id = t.wallet_id
  LEFT JOIN categories c
    ON c.id = t.category_id
`;

export async function getTransactions(): Promise<Transaction[]> {
  const db = await getDatabase();

  return db.getAllAsync<Transaction>(`
    ${SELECT_TRANSACTION}
    ORDER BY t.transaction_date DESC, t.id DESC
  `);
}

export async function getTransactionsByMonth(
  year: number,
  month: number
): Promise<Transaction[]> {
  const db = await getDatabase();

  const prefix = `${year}-${String(month).padStart(2, '0')}`;

  return db.getAllAsync<Transaction>(
    `
      ${SELECT_TRANSACTION}
      WHERE t.transaction_date LIKE ?
      ORDER BY t.transaction_date DESC, t.id DESC
    `,
    `${prefix}%`
  );
}

export async function getTransactionsByWallet(
  walletId: number
): Promise<Transaction[]> {
  const db = await getDatabase();

  return db.getAllAsync<Transaction>(
    `
      ${SELECT_TRANSACTION}
      WHERE t.wallet_id = ?
      ORDER BY t.transaction_date DESC, t.id DESC
    `,
    walletId
  );
}

export async function getTransactionById(
  id: number
): Promise<Transaction | null> {
  const db = await getDatabase();

  return db.getFirstAsync<Transaction>(
    `
      ${SELECT_TRANSACTION}
      WHERE t.id = ?
    `,
    id
  );
}

export async function createTransaction(data: {
  wallet_id: number;
  category_id?: number | null;
  type: TransactionType;
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
    type: TransactionType;
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

export type MonthlySummary = {
  currency_code: string;
  income: number;
  expense: number;
};

export async function getMonthlySummary(
  year: number,
  month: number
): Promise<MonthlySummary[]> {
  const db = await getDatabase();

  const prefix = `${year}-${String(month).padStart(2, '0')}`;

  const rows = await db.getAllAsync<{
    currency_code: string;
    income: number | null;
    expense: number | null;
  }>(
    `
      SELECT
        w.currency_code,

        COALESCE(SUM(
          CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END
        ), 0) AS income,

        COALESCE(SUM(
          CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END
        ), 0) AS expense

      FROM wallets w
      LEFT JOIN transactions t
        ON t.wallet_id = w.id
        AND t.transaction_date LIKE ?

      GROUP BY w.currency_code
      ORDER BY w.currency_code ASC
    `,
    `${prefix}%`
  );

  return rows.map((row) => ({
    currency_code: row.currency_code,
    income: row.income ?? 0,
    expense: row.expense ?? 0,
  }));
}

export type CategoryBreakdownItem = {
  category_id: number | null;
  name_key: string | null;
  icon: string | null;
  color: string | null;
  total: number;
};

export async function getCategoryBreakdown(
  year: number,
  month: number,
  type: TransactionType
): Promise<CategoryBreakdownItem[]> {
  const db = await getDatabase();

  const prefix = `${year}-${String(month).padStart(2, '0')}`;

  const rows = await db.getAllAsync<CategoryBreakdownItem>(
    `
      SELECT
        t.category_id AS category_id,
        c.name_key AS name_key,
        c.icon AS icon,
        c.color AS color,
        SUM(t.amount) AS total
      FROM transactions t
      LEFT JOIN categories c
        ON c.id = t.category_id
      WHERE t.type = ?
        AND t.transaction_date LIKE ?
      GROUP BY t.category_id
      ORDER BY total DESC
    `,
    type,
    `${prefix}%`
  );

  return rows;
}

export async function getMostRecentWalletId(): Promise<number | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{ wallet_id: number }>(
    `
      SELECT wallet_id
      FROM transactions
      ORDER BY transaction_date DESC, id DESC
      LIMIT 1
    `
  );

  return row?.wallet_id ?? null;
}

export type MonthlyTrendItem = {
  year: number;
  month: number;
  income: number;
  expense: number;
};

/**
 * ดึงยอดรายรับ/รายจ่ายรวมของ N เดือนล่าสุด นับรวมเดือนที่ระบุด้วย
 * ใช้สำหรับกราฟแท่งเปรียบเทียบแนวโน้มหลายเดือน — เดือนที่ไม่มีธุรกรรมจะได้ยอด 0 แทนที่จะถูกข้าม
 */
export async function getMonthlyTrend(
  year: number,
  month: number,
  monthsBack: number = 6
): Promise<MonthlyTrendItem[]> {
  const db = await getDatabase();

  const months: { year: number; month: number; key: string }[] = [];
  let y = year;
  let m = month;

  for (let i = 0; i < monthsBack; i++) {
    months.unshift({
      year: y,
      month: m,
      key: `${y}-${String(m).padStart(2, '0')}`,
    });

    m -= 1;
    if (m === 0) {
      m = 12;
      y -= 1;
    }
  }

  const startKey = months[0].key;
  const endKey = months[months.length - 1].key;

  const rows = await db.getAllAsync<{
    ym: string;
    income: number | null;
    expense: number | null;
  }>(
    `
      SELECT
        substr(t.transaction_date, 1, 7) AS ym,
        COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS expense
      FROM transactions t
      WHERE substr(t.transaction_date, 1, 7) >= ?
        AND substr(t.transaction_date, 1, 7) <= ?
      GROUP BY ym
    `,
    startKey,
    endKey
  );

  const lookup = new Map(rows.map((r) => [r.ym, r]));

  return months.map((entry) => {
    const found = lookup.get(entry.key);

    return {
      year: entry.year,
      month: entry.month,
      income: found?.income ?? 0,
      expense: found?.expense ?? 0,
    };
  });
}