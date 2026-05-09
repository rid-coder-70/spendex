import app from './src/app';
import dotenv from 'dotenv';
import { EmailService } from './src/services/emailService';
import { JobScheduler } from './src/jobs';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  const env = (process.env.NODE_ENV || 'development').padEnd(28);
  const port = String(PORT).padEnd(32);
  console.log(`
╔═══════════════════════════════════════╗
║   💰 SpendGuard API Server          ║
║   Environment: ${env}║
║   Port: ${port}║
║   URL: http://localhost:${PORT} ║
╚═══════════════════════════════════════╝
  `);

  // Initialize email service
  const emailInitialized = EmailService.initialize();
  if (emailInitialized) {
    await EmailService.verifyConnection();
  }

  // Start cron jobs
  JobScheduler.startAll();
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\n🛑 Received shutdown signal, closing server...');

  // Stop cron jobs
  JobScheduler.stopAll();

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