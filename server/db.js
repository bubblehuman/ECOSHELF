// Need Provider Project Update v2.1
// Database pool v2.1 — Stable PostgreSQL connection for Need Provider
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log connection errors (don't crash the process)
pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

/**
 * Execute a parameterized SQL query.
 * @param {string} text - SQL query string with $1, $2, ... placeholders
 * @param {any[]}  params - Parameter values
 * @returns {Promise<pg.QueryResult>}
 */
export const query = (text, params) => pool.query(text, params);

export default pool;
