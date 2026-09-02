import { getDatabase } from '@/database/database';

export async function seedDatabase(
  options: { includeDemoWallets?: boolean } = {}
) {
  const { includeDemoWallets = true } = options;
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

    // Wallets — เดโมนี้ใส่ให้เฉพาะตอนติดตั้งแอปครั้งแรกเท่านั้น
    // (ตอนกด "ล้างข้อมูลทั้งหมด" จะข้ามส่วนนี้ ไม่ใส่ยอดเงินตัวอย่างกลับมา)
    if (includeDemoWallets) {
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
    }

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

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.bills',
      'expense',
      'flash-outline',
      '#EAB308'
    );

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.health',
      'expense',
      'medkit-outline',
      '#0EA5E9'
    );

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.entertainment',
      'expense',
      'film-outline',
      '#6366F1'
    );

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.other_expense',
      'expense',
      'ellipsis-horizontal-outline',
      '#78716C'
    );

    await db.runAsync(
      `
      INSERT INTO categories
        (name_key, type, icon, color)
      VALUES (?, ?, ?, ?)
      `,
      'category.other_income',
      'income',
      'trending-up-outline',
      '#84CC16'
    );

    // ธุรกรรมตัวอย่างอ้างอิง wallet_id ของ Wallet เดโมด้านบน จึงต้องข้ามคู่กันไปด้วย
    if (includeDemoWallets) {
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
    }
  });

  console.log('✅ SQLite seed completed');
}