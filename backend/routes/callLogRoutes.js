import express from 'express';
import { getCallLogs, createCallLog } from '../controllers/callLogController.js';

const router = express.Router();

router.get('/', getCallLogs);
router.post('/', createCallLog);

export default router;
