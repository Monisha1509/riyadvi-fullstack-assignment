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

// CLIENT_ORIGIN supports a comma-separated list of exact origins.
// Example: http://localhost:5173,https://your-site.vercel.app
const normalizeOrigin = (value) => value.trim().replace(/\/+$/, '').toLowerCase();
const origins = [
  ...new Set(
    (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map(normalizeOrigin)
      .filter(Boolean)
  ),
];

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser calls (e.g. direct health checks) do not send Origin.
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      if (origins.includes(normalizedOrigin)) return callback(null, true);

      console.warn(`CORS blocked origin: ${origin}`);
      console.warn(`CORS allowed origins: ${origins.join(', ')}`);
      // Deny this origin without turning the CORS decision into a server 500.
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
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

const healthHandler = (_req, res) => {
  res.status(200).json({
    service: 'riyadvi-api',
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    commit: (process.env.RENDER_GIT_COMMIT || 'local').slice(0, 7),
  });
};

// Keep both paths: /api/health is the documented endpoint; /health is a simple alias.
app.get('/api/health', healthHandler);
app.get('/health', healthHandler);
app.get('/debug-check', (_req, res) => res.send('NEW CODE IS RUNNING'));
app.get('/', (_req, res) => {
  res.status(200).json({ service: 'riyadvi-api', status: 'running', health: '/api/health' });
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

const port = process.env.PORT;

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection failed:', err.message);
    }
  } else {
    console.warn('MONGODB_URI is missing: API starts, but submissions cannot be stored.');
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Riyadvi API listening on port ${port}`);
    console.log(`CORS allowed origins: ${origins.join(', ')}`);
    console.log(`app.get: /api/health and /health`);
  });
}

start();
