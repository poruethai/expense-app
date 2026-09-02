import { getDatabase } from '@/database/database';
import type { Transfer } from '@/types/transfer';

export async function getTransfers(): Promise<Transfer[]> {
  const db = await getDatabase();

  return db.getAllAsync<Transfer>(`
    SELECT *
    FROM transfers
    ORDER BY transfer_date DESC, id DESC
  `);
}

export async function getTransferById(
  id: number
): Promise<Transfer | null> {
  const db = await getDatabase();

  return db.getFirstAsync<Transfer>(
    `
      SELECT *
      FROM transfers
      WHERE id = ?
    `,
    id
  );
}

export async function createTransfer(data: {
  from_wallet_id: number;
  to_wallet_id: number;
  from_amount: number;
  to_amount: number;
  from_currency_code: string;
  to_currency_code: string;
  exchange_rate: number;
  note?: string | null;
  transfer_date: string;
}): Promise<number> {
  const db = await getDatabase();

  if (data.from_wallet_id === data.to_wallet_id) {
    throw new Error('Source and destination wallet cannot be the same');
  }

  if (data.from_amount <= 0 || data.to_amount <= 0) {
    throw new Error('Transfer amount must be greater than 0');
  }

  if (data.exchange_rate <= 0) {
    throw new Error('Exchange rate must be greater than 0');
  }

  const result = await db.runAsync(
    `
      INSERT INTO transfers (
        from_wallet_id,
        to_wallet_id,
        from_amount,
        to_amount,
        from_currency_code,
        to_currency_code,
        exchange_rate,
        note,
        transfer_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    data.from_wallet_id,
    data.to_wallet_id,
    data.from_amount,
    data.to_amount,
    data.from_currency_code,
    data.to_currency_code,
    data.exchange_rate,
    data.note ?? null,
    data.transfer_date
  );

  return result.lastInsertRowId;
}

export async function updateTransfer(
  id: number,
  data: {
    from_wallet_id: number;
    to_wallet_id: number;
    from_amount: number;
    to_amount: number;
    from_currency_code: string;
    to_currency_code: string;
    exchange_rate: number;
    note?: string | null;
    transfer_date: string;
  }
): Promise<void> {
  const db = await getDatabase();

  if (data.from_wallet_id === data.to_wallet_id) {
    throw new Error('Source and destination wallet cannot be the same');
  }

  if (data.from_amount <= 0 || data.to_amount <= 0) {
    throw new Error('Transfer amount must be greater than 0');
  }

  if (data.exchange_rate <= 0) {
    throw new Error('Exchange rate must be greater than 0');
  }

  await db.runAsync(
    `
      UPDATE transfers
      SET
        from_wallet_id = ?,
        to_wallet_id = ?,
        from_amount = ?,
        to_amount = ?,
        from_currency_code = ?,
        to_currency_code = ?,
        exchange_rate = ?,
        note = ?,
        transfer_date = ?
      WHERE id = ?
    `,
    data.from_wallet_id,
    data.to_wallet_id,
    data.from_amount,
    data.to_amount,
    data.from_currency_code,
    data.to_currency_code,
    data.exchange_rate,
    data.note ?? null,
    data.transfer_date,
    id
  );
}

export async function deleteTransfer(id: number): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      DELETE FROM transfers
      WHERE id = ?
    `,
    id
  );
}

export type TransferWithWallets = Transfer & {
  from_wallet_name: string;
  to_wallet_name: string;
};

export async function getTransfersByMonth(
  year: number,
  month: number
): Promise<TransferWithWallets[]> {
  const db = await getDatabase();

  const prefix = `${year}-${String(month).padStart(2, '0')}`;

  return db.getAllAsync<TransferWithWallets>(
    `
      SELECT
        tr.*,
        fw.name AS from_wallet_name,
        tw.name AS to_wallet_name
      FROM transfers tr
      INNER JOIN wallets fw ON fw.id = tr.from_wallet_id
      INNER JOIN wallets tw ON tw.id = tr.to_wallet_id
      WHERE tr.transfer_date LIKE ?
      ORDER BY tr.transfer_date DESC, tr.id DESC
    `,
    `${prefix}%`
  );
}