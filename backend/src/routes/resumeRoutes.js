import express from 'express';

import {
  createResume,
  getResume,
  getResumes,
  updateResume,
  deleteResume,
  toggleResumeSharing,
  getPublicResume,
} from '../controllers/resumeController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createResume);

router.get('/', authMiddleware, getResumes);

router.get('/public/:shareToken', getPublicResume);

router.get('/:id', authMiddleware, getResume);

router.put('/:id', authMiddleware, updateResume);

router.patch('/:id/share', authMiddleware, toggleResumeSharing);

router.delete('/:id', authMiddleware, deleteResume);

export default router;
