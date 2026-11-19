import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import authRoutes from './routes/auth.js';
import examRoutes from './routes/exam.js';
import attemptRoutes from './routes/attempt.js';
import reportRoutes from './routes/report.js';
import superadminRoutes from './routes/superadmin.js';
import studentRoutes from './routes/student.js';
import userRoutes from './routes/user.js';
import User from './models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint for deployment monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve client build in production if available
const clientDist = path.join(__dirname, '../client/dist');
if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true' || fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onlineexam';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log(`Connected to MongoDB at ${MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@')}`);
    
    // Seed Super Admin
    try {
      const superAdminExists = await User.findOne({ email: 'superadmin1@gmail.com' });
      if (!superAdminExists) {
        await User.create({
          name: 'Super Admin',
          email: 'superadmin1@gmail.com',
          password: 'superadmin',
          role: 'superadmin'
        });
        console.log('Super Admin seeded successfully');
      }
    } catch (err) {
      console.error('Error seeding super admin:', err.message);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });
