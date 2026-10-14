import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import leadRoutes from './routes/leads.js';
import adminRoutes from './routes/admin.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());

const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((x) => x.trim().replace(/\/+$/, '').toLowerCase())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      const normalizedOrigin = origin?.replace(/\/+$/, '').toLowerCase();

      if (
        !origin ||
        origins.includes('*') ||
        origins.includes(normalizedOrigin)
      ) {
        return cb(null, true);
      }

      console.warn('CORS blocked origin:', origin);
      console.warn('Allowed origins:', origins);
      return cb(null, false);
    },
  })
);

app.use(express.json({ limit: '100kb' }));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    commit: (process.env.RENDER_GIT_COMMIT || 'local').slice(0, 7),
  });
});

app.use('/api', leadRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'API route not found.' });
});

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong.'
        : 'Server error. Check backend logs and environment configuration.',
  });
});

const port = Number(process.env.PORT) || 5000;

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
    }
  } else {
    console.warn(
      'MONGODB_URI is missing: API starts, but submissions cannot be stored.'
    );
  }

  app.listen(port, () => {
    console.log(`Riyadvi API listening on port ${port}`);
    console.log(`CORS allowed origins: ${origins.join(', ')}`);
  });
}

start();