import { getDatabase } from '@/database/database';

export async function createCurrenciesTable() {
  const db = await getDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS currencies (
      code TEXT PRIMARY KEY,
      name_key TEXT NOT NULL,
      symbol TEXT NOT NULL,
      decimal_digits INTEGER NOT NULL DEFAULT 2,
      is_active INTEGER NOT NULL DEFAULT 1
    );
  `);
}