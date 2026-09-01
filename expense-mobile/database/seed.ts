import { getDatabase } from '@/database/database';

export async function seedDatabase() {
  const db = await getDatabase();

  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count FROM currencies`
  );

  if ((result?.count ?? 0) > 0) {
    console.log('ℹ️ Database already has seed data');
    return;
  }

  await db.withTransactionAsync(async () => {
    // Currencies
    await db.runAsync(
      `
      INSERT INTO currencies
        (code, name_key, symbol, decimal_digits)
      VALUES (?, ?, ?, ?)
      `,
      'THB',
      'currency.thb',
      '฿',
      2
    );

    await db.runAsync(
      `
      INSERT INTO currencies
        (code, name_key, symbol, decimal_digits)
      VALUES (?, ?, ?, ?)
      `,
      'USD',
      'currency.usd',
      '$',
      2
    );

    // Wallets
    await db.runAsync(
      `
      INSERT INTO wallets
        (name, currency_code, initial_balance)
      VALUES (?, ?, ?)
      `,
      'เงินสด',
      'THB',
      2000
    );

    await db.runAsync(
      `
      INSERT INTO wallets
        (name, currency_code, initial_balance)
      VALUES (?, ?, ?)
      `,
      'KBank',
      'THB',
      10000
    );

    await db.runAsync(
      `
      INSERT INTO wallets
        (name, currency_code, initial_balance)
      VALUES (?, ?, ?)
      `,
      'TrueMoney',
      'THB',
      500
    );

    // Categories
    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.food',
      'expense',
      'food',
      '#F97316'
    );

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.salary',
      'income',
      'wallet',
      '#16A34A'
    );

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.drink',
      'expense',
      'coffee',
      '#8B5CF6'
    );

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.transport',
      'expense',
      'car',
      '#3B82F6'
    );

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.shopping',
      'expense',
      'shopping-bag',
      '#EC4899'
    );

    // August
    await db.runAsync(
      `
      INSERT INTO transactions
        (wallet_id, category_id, type, amount, note, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      1,
      1,
      'expense',
      250,
      'ข้าวกลางวัน',
      '2026-08-18'
    );

    await db.runAsync(
      `
      INSERT INTO transactions
        (wallet_id, category_id, type, amount, note, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      2,
      2,
      'income',
      5000,
      'เงินเดือน',
      '2026-08-17'
    );

    await db.runAsync(
      `
      INSERT INTO transactions
        (wallet_id, category_id, type, amount, note, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      1,
      3,
      'expense',
      120,
      'กาแฟ',
      '2026-08-16'
    );

    await db.runAsync(
      `
      INSERT INTO transactions
        (wallet_id, category_id, type, amount, note, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      2,
      4,
      'expense',
      80,
      'ค่าเดินทาง',
      '2026-08-15'
    );

    await db.runAsync(
      `
      INSERT INTO transactions
        (wallet_id, category_id, type, amount, note, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      2,
      5,
      'expense',
      800,
      'ซื้อของ',
      '2026-08-10'
    );

    // July
    await db.runAsync(
      `
      INSERT INTO transactions
        (wallet_id, category_id, type, amount, note, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      1,
      2,
      'income',
      3000,
      'รายได้เสริม',
      '2026-07-10'
    );

    await db.runAsync(
      `
      INSERT INTO transactions
        (wallet_id, category_id, type, amount, note, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      1,
      1,
      'expense',
      450,
      'อาหาร',
      '2026-07-12'
    );
  });

  console.log('✅ SQLite seed completed');
}