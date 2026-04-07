require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── 1. Middleware (MUST come first) ───────────────────────────
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));
app.use(express.json()); // Essential for POST requests

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ── 2. Routes ────────────────────────────────────────────────
app.use('/api/auth', require('./auth'));
app.use('/api/admin', require('./admin'));
app.use('/api/doctor', require('./doctor'));
app.use('/api/patient', require('./patient'));

// ── 3. Handlers ──────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));
app.use((_, res) => res.status(404).json({ message: 'Route not found.' }));

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`🚀 CityCare API running → http://localhost:${PORT}`);
});