import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DATABASE_URL ? undefined : (process.env.DB_HOST || 'localhost'),
  port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DATABASE_URL ? undefined : (process.env.DB_NAME || 'spendguard'),
  user: process.env.DATABASE_URL ? undefined : (process.env.DB_USER || 'postgres'),
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, 
});

if (isProduction) {
  const connectionSource = process.env.DATABASE_URL ? 'DATABASE_URL' : 'manual config';
  console.log(`Attempting DB connection via ${connectionSource}...`);
}

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  if (!isProduction) {
    process.exit(-1);
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
