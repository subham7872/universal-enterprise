import express from 'express';
import { getOrders, getOrderByReference } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:referenceId', getOrderByReference);

export default router;
