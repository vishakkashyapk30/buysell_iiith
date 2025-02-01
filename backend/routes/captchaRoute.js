// routes/captchaRoute.js
import express from 'express';
import { generateCaptcha } from '../middleware/captcha.js';

const router = express.Router();

router.get('/generate', (req, res) => {
  const captcha = generateCaptcha();
  res.json(captcha);
});

export default router;