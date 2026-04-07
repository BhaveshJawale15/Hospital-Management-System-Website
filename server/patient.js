const router = require('express').Router();
const db = require('./db');
const { protect } = require('./middleware');

router.use(protect);

// ── POST /api/patient/appointments ───────────────────────────
router.post('/appointments', async (req, res) => {
  try {
    const { dept, slot, notes, doctor_id } = req.body;
    
    // If frontend doesn't send a doctor_id, find the first doctor in that dept
    let finalDoctorId = doctor_id;
    if (!finalDoctorId) {
      const [doctors] = await db.query(
        `SELECT id FROM users WHERE role='doctor' AND department=? LIMIT 1`,
        [dept]
      );
      if (doctors.length === 0) return res.status(404).json({ message: 'No doctor in this dept.' });
      finalDoctorId = doctors[0].id;
    }

    const [result] = await db.query(
      `INSERT INTO appointments (patient_id, doctor_id, dept, slot, notes) VALUES (?,?,?,?,?)`,
      [req.user.id, finalDoctorId, dept, slot, notes || null]
    );
    res.status(201).json({ message: 'Appointment booked successfully.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Keep your other GET routes (profile, billing, etc.) here...

module.exports = router;