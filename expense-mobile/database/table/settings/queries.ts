import { getDatabase } from '@/database/database';
import type { Setting } from '@/types/setting';

export async function getSettings(): Promise<Setting[]> {
  const db = await getDatabase();

  return db.getAllAsync<Setting>(`
    SELECT *
    FROM settings
    ORDER BY key ASC
  `);
}

export async function getSetting(
  key: string
): Promise<Setting | null> {
  const db = await getDatabase();

  return db.getFirstAsync<Setting>(
    `
      SELECT *
      FROM settings
      WHERE key = ?
    `,
    key
  );
}

export async function getSettingValue(
  key: string
): Promise<string | null> {
  const setting = await getSetting(key);

  return setting?.value ?? null;
}

export async function setSetting(
  key: string,
  value: string
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      INSERT INTO settings (
        key,
        value,
        updated_at
      )
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key)
      DO UPDATE SET
        value = excluded.value,
        updated_at = CURRENT_TIMESTAMP
    `,
    key,
    value
  );
}

export async function deleteSetting(key: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      DELETE FROM settings
      WHERE key = ?
    `,
    key
  );
}