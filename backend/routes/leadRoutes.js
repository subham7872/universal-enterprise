import express from 'express';
import { submitLead, getLeads, updateLead } from '../controllers/leadController.js';

const router = express.Router();

// Public lead submission endpoint
router.post('/submit', submitLead);

// Lead management for CRM
router.get('/', getLeads);
router.put('/:id', updateLead);
router.patch('/:id', updateLead);

export default router;
