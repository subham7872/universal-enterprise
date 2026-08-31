import express from 'express';
import { sendEmail } from '../controllers/emailController.js';

const router = express.Router();

// Direct email dispatch endpoint
router.post('/send', async (req, res) => {
  try {
    const { to, subject, htmlContent, textContent } = req.body;
    if (!to || !subject) {
      return res.status(400).json({ error: 'Recipient "to" and "subject" are required.' });
    }

    const result = await sendEmail({ to, subject, htmlContent, textContent });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
