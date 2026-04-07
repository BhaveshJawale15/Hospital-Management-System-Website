const router    = require('express').Router();
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const db = require('./db');

// ── Helper: sign JWT ──────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, phone, password, gender, dob } = req.body;

    if (!full_name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' });

    // Check duplicate email
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already registered. Please log in.' });

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, phone, password, gender, dob, role)
       VALUES (?, ?, ?, ?, ?, ?, 'patient')`,
      [full_name, email, phone || null, hashed, gender || null, dob || null]
    );

    const user = { id: result.insertId, full_name, role: 'patient' };
    const token = signToken(user);

    res.status(201).json({
      message : 'Account created successfully.',
      token,
      user    : { id: user.id, name: full_name, role: 'patient' },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ message: 'Email, password and role are required.' });

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, role]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid credentials or role.' });

    const user    = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect password.' });

    const token = signToken(user);

    res.json({
      message : 'Login successful.',
      token,
      user    : { id: user.id, name: user.full_name, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// 1. Verify if email exists
router.post('/verify-email', async (req, res) => {
  const { email } = req.body;
  const [user] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (user.length === 0) return res.status(404).json({ message: 'No account found with this email.' });
  res.json({ message: 'User verified.' });
});

// 2. Actually update the password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);
  await db.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);
  res.json({ message: 'Password updated successfully.' });
});

module.exports = router;
