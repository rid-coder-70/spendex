import dotenv from 'dotenv';

dotenv.config();

export const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  from: {
    name: 'SpendGuard',
    email: process.env.EMAIL_USER || 'noreply@spendguard.com',
  },
};

export const validateEmailConfig = (): boolean => {
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('⚠️  Email credentials not configured');
    return false;
  }
  return true;
};