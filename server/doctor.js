const express = require('express');
const router = express.Router();
const db = require('./db');
const { protect } = require('./middleware'); // Ensure you have protect middleware

// Apply protection to all doctor routes
router.use(protect);

// ── GET /api/doctor/queue (Fixed for your Frontend) ──────────
// In server/doctor.js
router.get('/queue', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*, u.full_name as patient_name 
       FROM appointments a 
       JOIN users u ON a.patient_id = u.id 
       WHERE a.doctor_id = ? AND a.status = 'pending'`, 
      [req.user.id] // Uses the ID from your 'protect' middleware
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/doctor/records ──────────────────────────────────
router.get('/records', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, u.full_name AS patient_name
         FROM medical_records r
         JOIN users u ON r.patient_id = u.id
        WHERE r.doctor_id = ?
        ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Keep your other routes (prescriptions, patients, etc.) here...

module.exports = router; // Keep this ONLY at the very bottom