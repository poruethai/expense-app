import { getDatabase } from '@/database/database';

export async function createTransfersTable() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      from_wallet_id INTEGER NOT NULL,
      to_wallet_id INTEGER NOT NULL,

      from_amount REAL NOT NULL CHECK (from_amount > 0),
      to_amount REAL NOT NULL CHECK (to_amount > 0),

      from_currency_code TEXT NOT NULL,
      to_currency_code TEXT NOT NULL,

      exchange_rate REAL NOT NULL DEFAULT 1,

      note TEXT,

      transfer_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (from_wallet_id)
        REFERENCES wallets(id)
        ON DELETE RESTRICT,

      FOREIGN KEY (to_wallet_id)
        REFERENCES wallets(id)
        ON DELETE RESTRICT,

      FOREIGN KEY (from_currency_code)
        REFERENCES currencies(code)
        ON DELETE RESTRICT,

      FOREIGN KEY (to_currency_code)
        REFERENCES currencies(code)
        ON DELETE RESTRICT
    );
  `);
}