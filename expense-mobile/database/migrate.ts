import { getDatabase } from '@/database/database';
import { seedDatabase } from '@/database/seed';

import { createCurrenciesTable } from '@/database/table/currencies/schema';
import { createWalletsTable } from '@/database/table/wallets/schema';
import { createCategoriesTable } from '@/database/table/categories/schema';
import { createTransactionsTable } from '@/database/table/transactions/schema';
import { createTransfersTable } from '@/database/table/transfers/schema';
import { createSettingsTable } from '@/database/table/settings/schema';

const DATABASE_VERSION = 1;

export async function migrateDatabase() {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  const currentVersion = result?.user_version ?? 0;

  await db.execAsync('PRAGMA foreign_keys = ON;');

  if (currentVersion < DATABASE_VERSION) {
    await db.withTransactionAsync(async () => {
      if (currentVersion < 1) {
        await createCurrenciesTable();
        await createWalletsTable();
        await createCategoriesTable();
        await createTransactionsTable();
        await createTransfersTable();
        await createSettingsTable();
      }

      await db.execAsync(
        `PRAGMA user_version = ${DATABASE_VERSION};`
      );
    });
  }

  await seedDatabase();
}