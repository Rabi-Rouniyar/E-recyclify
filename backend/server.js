import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import passport from 'passport';
import './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import recyclerRoutes from './routes/recyclerRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
import mapRoutes from './routes/mapRoutes.js';

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

// ==========================================
// 🔥 CORS (FIXED FOR RENDER DEPLOYMENT)
// ==========================================

const allowedOrigins = [
  'https://e-recyclify-frontend.onrender.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

app.options('*', cors()); // handle preflight

// ==========================================
// Middlewares
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security
app.use(helmet());

// Passport
app.use(passport.initialize());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================================
// Routes
// ==========================================

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/recyclers', recyclerRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/maps', mapRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend working 🚀'
  });
});

// ==========================================
// Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
