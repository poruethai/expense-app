import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('expense.db');

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
    `);
  }

  return db;
}

// ใช้เฉพาะตอนพัฒนา
export async function resetDatabase() {
  if (db) {
    await db.closeAsync();
    db = null;
  }

  await SQLite.deleteDatabaseAsync('expense.db');

  console.log('🗑️ Database reset');
}