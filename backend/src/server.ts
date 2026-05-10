import app from './app';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { query } from './config/database';
import { CategoryModel } from './models/Category';
import { EmailService } from './services/emailService';
import { JobScheduler } from './jobs';

dotenv.config();

const PORT = process.env.PORT || 5000;

let server: any;

const initializeDatabase = async () => {
  try {
    // Check if users table exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
    const res = await query(checkTableQuery);
    
    if (!res.rows[0].exists) {
      console.log('📂 Database is empty. Initializing schema...');
      // Read schema.sql from the root database folder
      // In production, the path might be different, so we try multiple locations
      const schemaPaths = [
        path.join(__dirname, '../../database/schema.sql'),
        path.join(__dirname, '../database/schema.sql'),
        path.join(process.cwd(), '../database/schema.sql'),
        path.join(process.cwd(), 'database/schema.sql')
      ];
      
      let schemaSql = '';
      for (const p of schemaPaths) {
        if (fs.existsSync(p)) {
          schemaSql = fs.readFileSync(p, 'utf-8');
          break;
        }
      }

      if (schemaSql) {
        await query(schemaSql);
        console.log('✅ Database initialized successfully');
      } else {
        console.warn('⚠️ schema.sql not found. Please initialize database manually.');
      }
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
};

const startServer = async () => {
  try {
    // 1. Initialize Database Tables
    await initializeDatabase();

    // 2. Initialize Email Service
    EmailService.initialize();
    
    // 3. Start background jobs
    JobScheduler.startAll();

    // 4. Seed Categories
    await CategoryModel.seedDefaults();
    console.log('✅ Default categories seeded');
  } catch (error: any) {
    console.error('Failed during startup:', error);
  }

  server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║     💰 SpendGuard API Server         ║
║     Environment: ${process.env.NODE_ENV?.padEnd(18)}║
║     Port: ${PORT}                         ║
║     URL: http://localhost:${PORT}       ║
╚═══════════════════════════════╝
    `);
  });
};

startServer();

const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal, closing server...');
  if (server) {
    server.close(() => {
      console.log('✅ Server closed successfully');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }

  setTimeout(() => {
    console.error('❌ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);