import express from 'express';
import { getWorkflows, createWorkflow, toggleWorkflow } from '../controllers/workflowController.js';

const router = express.Router();

router.get('/', getWorkflows);
router.post('/', createWorkflow);
router.patch('/:id/toggle', toggleWorkflow);

export default router;
