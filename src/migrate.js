import { pool } from './db.js';

export async function runMigrations() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS short_urls (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        target TEXT NOT NULL,
        visits INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Migration completed: short_urls table is ready');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
}
