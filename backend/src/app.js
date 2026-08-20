import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
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
