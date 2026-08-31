import express from 'express';
import { login, verifyTokenValidity } from '../controllers/authController.js';

const router = express.Router();

// CRM Admin Login
router.post('/login', login);

// Token validation
router.get('/verify', verifyTokenValidity);

export default router;
