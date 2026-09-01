import { getDatabase } from '@/database/database';
import type { Currency } from '@/types/currency';

export async function getCurrencies(): Promise<Currency[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<Currency>(`
    SELECT *
    FROM currencies
    ORDER BY code ASC
  `);

  return rows.map((row) => ({
    ...row,
    is_active: Boolean(row.is_active),
  }));
}

export async function getActiveCurrencies(): Promise<Currency[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<Currency>(`
    SELECT *
    FROM currencies
    WHERE is_active = 1
    ORDER BY code ASC
  `);

  return rows.map((row) => ({
    ...row,
    is_active: Boolean(row.is_active),
  }));
}

export async function getCurrencyByCode(
  code: string
): Promise<Currency | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<Currency>(
    `
      SELECT *
      FROM currencies
      WHERE code = ?
    `,
    code
  );

  if (!row) {
    return null;
  }

  return {
    ...row,
    is_active: Boolean(row.is_active),
  };
}

export async function createCurrency(data: {
  code: string;
  name_key: string;
  symbol: string;
  decimal_digits?: number;
}): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      INSERT INTO currencies (
        code,
        name_key,
        symbol,
        decimal_digits
      )
      VALUES (?, ?, ?, ?)
    `,
    data.code.toUpperCase(),
    data.name_key,
    data.symbol,
    data.decimal_digits ?? 2
  );
}

export async function updateCurrency(
  code: string,
  data: {
    name_key: string;
    symbol: string;
    decimal_digits: number;
  }
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      UPDATE currencies
      SET
        name_key = ?,
        symbol = ?,
        decimal_digits = ?
      WHERE code = ?
    `,
    data.name_key,
    data.symbol,
    data.decimal_digits,
    code
  );
}

export async function setCurrencyActive(
  code: string,
  isActive: boolean
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      UPDATE currencies
      SET is_active = ?
      WHERE code = ?
    `,
    isActive ? 1 : 0,
    code
  );
}

export async function deleteCurrency(code: string): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      DELETE FROM currencies
      WHERE code = ?
    `,
    code
  );
}