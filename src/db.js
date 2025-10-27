import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config(); // ✅ ensure environment variables are loaded first

const { Pool } = pkg;

// Prefer DATABASE_URL, fallback to explicit fields
const connectionString = process.env.DATABASE_URL;
let pool;

if (connectionString && typeof connectionString === 'string') {
  pool = new Pool({ connectionString });
} else {
  pool = new Pool({
    user: process.env.PGUSER || 'shortuser',
    password: process.env.PGPASSWORD || 'shortpass',
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
    database: process.env.PGDATABASE || 'shortener',
  });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(__dirname, 'migrations', '001_create_table.sql');
const sql = fs.readFileSync(migrationPath, 'utf-8');

(async () => {
  try {
    await pool.query(sql);
    console.log('✅ Database migrated successfully');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
})();

export { pool };
