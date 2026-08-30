import express from 'express';
import { getQuotes, createQuote, getQuoteById, getQuotesByEmail } from '../controllers/quoteController.js';

const router = express.Router();

router.get('/', getQuotes);
router.get('/by-email', getQuotesByEmail);
router.get('/:id', getQuoteById);
router.post('/', createQuote);

export default router;
