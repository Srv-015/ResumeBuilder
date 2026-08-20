import express from 'express';

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from '../controllers/authController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/* =====================================================
   REGISTER
===================================================== */

router.post('/register', registerUser);

/* =====================================================
   LOGIN
===================================================== */

router.post('/login', loginUser);

/* =====================================================
   GET PROFILE
===================================================== */

router.get('/profile', authMiddleware, getProfile);

/* =====================================================
   UPDATE PROFILE
===================================================== */

router.put('/profile', authMiddleware, updateProfile);

/* =====================================================
   CHANGE PASSWORD
===================================================== */

router.put('/change-password', authMiddleware, changePassword);

/* =====================================================
   DELETE ACCOUNT
===================================================== */

router.delete('/account', authMiddleware, deleteAccount);

export default router;
