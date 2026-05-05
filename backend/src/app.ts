import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { query } from './config/database';

import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

const app: Application = express();


app.use(helmet());


app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});


app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'SpendGuard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
  });
});

app.get('/api/health/db', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT NOW() as time, version() as version');
    res.json({
      success: true,
      message: 'Database connected',
      data: {
        timestamp: result.rows[0].time,
        version: result.rows[0].version,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});


app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'ROUTE_NOT_FOUND',
    },
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);
  
  const statusCode = (err as any).statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      code: (err as any).code || 'INTERNAL_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

export default app;