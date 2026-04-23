import app from './src/app.ts';
import pool from './src/config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test DB connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection established');

    app.listen(PORT, () => {
      console.log(`🚀 SpendGuard API server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
