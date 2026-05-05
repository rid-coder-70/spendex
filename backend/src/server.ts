import app from './app';
import dotenv from 'dotenv';
import { CategoryModel } from './models/Category';

dotenv.config();

const PORT = process.env.PORT || 5000;

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    await CategoryModel.seedDefaults();
    console.log('✅ Default categories seeded');
  } catch (error: any) {
    console.error('Failed to seed default categories:', error);
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

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal, closing server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);