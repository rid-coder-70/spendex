import app from './src/app';
import dotenv from 'dotenv';
import { Server } from 'http';

dotenv.config();

const PORT: string | number = process.env.PORT || 5000;

const server: Server = app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║     💰 SpendGuard API Server         ║
  ║     Environment: ${process.env.NODE_ENV || 'development'}       ║
  ║     Port: ${PORT}                         ║
  ║     URL: http://localhost:${PORT}       ║
  ╚═══════════════════════════════════════╝
  `);
});


process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received (Ctrl+C), closing server...');
  server.close(() => {
    process.exit(0);
  });
});