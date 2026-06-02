import { query } from '../config/database';
import dotenv from 'dotenv';
dotenv.config();

async function reset() {
  try {
    const result = await query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public';
    `);
    
    const tables = result.rows.map(row => '"' + row.tablename + '"').join(', ');
    
    if (tables.length > 0) {
        console.log(`Truncating tables: ${tables}`);
        await query(`TRUNCATE TABLE ${tables} CASCADE;`);
        console.log('Dataset reset successfully.');
    } else {
        console.log('No tables found in the public schema.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error resetting dataset:', error);
    process.exit(1);
  }
}

reset();
