import { getDatabase } from '@/database/database';
import type { Category, CategoryType } from '@/types/category';

export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<Category>(`
    SELECT *
    FROM categories
    ORDER BY id ASC
  `);

  return rows.map((row) => ({
    ...row,
    is_active: Boolean(row.is_active),
  }));
}

export async function getCategoriesByType(
  type: CategoryType
): Promise<Category[]> {
  const db = await getDatabase();

  const rows = await db.getAllAsync<Category>(
    `
      SELECT *
      FROM categories
      WHERE type = ?
        AND is_active = 1
      ORDER BY id ASC
    `,
    type
  );

  return rows.map((row) => ({
    ...row,
    is_active: Boolean(row.is_active),
  }));
}

export async function getCategoryById(
  id: number
): Promise<Category | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<Category>(
    `
      SELECT *
      FROM categories
      WHERE id = ?
    `,
    id
  );

  if (!row) {
    return null;
  }

  return {
    ...row,
    is_active: Boolean(row.is_active),
  };
}

export async function createCategory(data: {
  name_key: string;
  type: CategoryType;
  icon?: string | null;
  color?: string | null;
}): Promise<number> {
  const db = await getDatabase();

  const result = await db.runAsync(
    `
      INSERT INTO categories (
        name_key,
        type,
        icon,
        color
      )
      VALUES (?, ?, ?, ?)
    `,
    data.name_key,
    data.type,
    data.icon ?? null,
    data.color ?? null
  );

  return result.lastInsertRowId;
}

export async function updateCategory(
  id: number,
  data: {
    name_key: string;
    type: CategoryType;
    icon?: string | null;
    color?: string | null;
  }
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      UPDATE categories
      SET
        name_key = ?,
        type = ?,
        icon = ?,
        color = ?
      WHERE id = ?
    `,
    data.name_key,
    data.type,
    data.icon ?? null,
    data.color ?? null,
    id
  );
}

export async function setCategoryActive(
  id: number,
  isActive: boolean
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      UPDATE categories
      SET is_active = ?
      WHERE id = ?
    `,
    isActive ? 1 : 0,
    id
  );
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `
      DELETE FROM categories
      WHERE id = ?
    `,
    id
  );
}