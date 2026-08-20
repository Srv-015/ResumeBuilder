import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://resume-builder-sigma-woad.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`REQUEST: ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: 'Resume Builder API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);

console.log('AUTH ROUTES MOUNTED');
console.log('RESUME ROUTES MOUNTED');

export default app;
