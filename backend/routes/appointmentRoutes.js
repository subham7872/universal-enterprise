import express from 'express';
import { getAppointments, createAppointment, updateAppointment } from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', getAppointments);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);

export default router;
