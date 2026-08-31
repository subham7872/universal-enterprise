import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

import errorHandler from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import callLogRoutes from './routes/callLogRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import authRoutes from './routes/authRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

export const createApp = () => {
  const app = express();

  // Trust first proxy (Nginx reverse proxy)
  app.set('trust proxy', 1);

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));

  // CORS config
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.use(cors({
    origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Rate limiting for AI and general APIs
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests from this IP, please try again later.' }
  });

  app.use('/api', apiLimiter);

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads serving
  app.use('/uploads', express.static(uploadsDir));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      service: 'Universal Enterprise Backend API',
      status: 'operational',
      timestamp: new Date().toISOString()
    });
  });

  // REST API Routes
  app.use('/api/products', productRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/quotes', quoteRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/appointments', appointmentRoutes);
  app.use('/api/calls', callLogRoutes);
  app.use('/api/workflows', workflowRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/email', emailRoutes);

  // Fallback 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: `Endpoint '${req.originalUrl}' not found.` });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
