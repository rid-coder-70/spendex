import app from './src/app';
import dotenv from 'dotenv';
import { EmailService } from './src/services/emailService';
import { JobScheduler } from './src/jobs';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  // Print server startup banner
  console.log('\n╔═══════════════════════════════════════╗');
  console.log('║   💰 SpendGuard API Server          ║');
  console.log(`║   Environment: ${String(process.env.NODE_ENV || 'development').padEnd(23)}║`);
  console.log(`║   Port: ${String(PORT).padEnd(31)}║`);
  console.log(`║   URL: http://localhost:${PORT}     ║`);
  console.log('╚═══════════════════════════════════════╝\n');

  console.log('🔄 Initializing services...');

  // Initialize email service
  try {
    console.log('📧 Setting up email service...');
    const emailInitialized = EmailService.initialize();
    if (emailInitialized) {
      console.log('🔗 Verifying email connection...');
      await EmailService.verifyConnection();
    }
  } catch (error) {
    console.error('❌ Email service error:', error);
  }

  // Start cron jobs
  try {
    console.log('⏰ Starting cron jobs...');
    JobScheduler.startAll();
    console.log('✅ Services initialized successfully');
  } catch (error) {
    console.error('❌ Cron job scheduler error:', error);
  }
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