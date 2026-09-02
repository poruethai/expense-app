import { getDatabase } from '@/database/database';

export async function createBudgetsTable() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      name TEXT NOT NULL,

      wallet_id INTEGER,
      category_id INTEGER,

      amount REAL NOT NULL CHECK (amount > 0),

      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (wallet_id)
        REFERENCES wallets(id)
        ON DELETE CASCADE,

      FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
    );
  `);
}
