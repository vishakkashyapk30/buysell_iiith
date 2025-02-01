// middleware/captcha.js
import { createCanvas } from 'canvas';
import crypto from 'crypto';

// Store captcha data temporarily (in production, use Redis or similar)
const captchaStore = new Map();

// Clean up expired captchas
setInterval(() => {
  const now = Date.now();
  for (const [id, data] of captchaStore.entries()) {
    if (now - data.timestamp > 10 * 60 * 1000) { // 10 minutes expiry
      captchaStore.delete(id);
    }
  }
}, 60 * 1000);

export const generateCaptcha = () => {
  const canvas = createCanvas(200, 70);
  const ctx = canvas.getContext('2d');
  
  // Generate random string
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let captchaText = '';
  for (let i = 0; i < 6; i++) {
    captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Background
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add noise
  for (let i = 0; i < 50; i++) {
    ctx.strokeStyle = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  // Add text
  ctx.font = '38px Arial';
  ctx.fillStyle = '#000';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  
  // Add each character with random rotation
  for (let i = 0; i < captchaText.length; i++) {
    const x = (canvas.width / captchaText.length) * (i + 0.5);
    const y = canvas.height / 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.4);
    ctx.fillText(captchaText[i], 0, 0);
    ctx.restore();
  }

  const id = crypto.randomBytes(16).toString('hex');
  captchaStore.set(id, {
    text: captchaText,
    timestamp: Date.now()
  });

  return {
    image: canvas.toBuffer().toString('base64'),
    id
  };
};

export const validateCaptcha = async (req, res, next) => {
  const { captchaId, captchaAnswer } = req.body;
  
  if (!captchaId || !captchaAnswer) {
    return res.status(400).json({ message: 'Captcha is required' });
  }

  const captchaData = captchaStore.get(captchaId);
  
  if (!captchaData) {
    return res.status(400).json({ message: 'Captcha expired' });
  }

  if (captchaData.text !== captchaAnswer.toUpperCase()) {
    captchaStore.delete(captchaId);
    return res.status(400).json({ message: 'Invalid captcha' });
  }

  captchaStore.delete(captchaId);
  next();
};
