import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     💰 SpendGuard API Server         ║
║     Environment: ${process.env.NODE_ENV?.padEnd(18)}║
║     Port: ${PORT}                         ║
║     URL: http://localhost:${PORT}       ║
╚═══════════════════════════════════════╝
  `);
});

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