import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Please provide email, password, and role.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.findUser(normalizedEmail, role);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email, password, or role selection.' });
  }

  return res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

export default router;
