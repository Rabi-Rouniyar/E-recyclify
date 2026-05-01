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

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ==========================================
// Middlewares
// ==========================================
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(cookieParser()); // Parse cookies

// Serve local uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS configuration for frontend connection
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Security headers
app.use(helmet());
app.use(passport.initialize());

// HTTP request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==========================================
// Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/recyclers', recyclerRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/maps', mapRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'E-Recyclify API is running...' });
});

// ==========================================
// Error Handling Middleware (To be added later)
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
