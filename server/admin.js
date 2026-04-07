const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('./db');
const { protect, restrictTo } = require('./middleware');

router.use(protect, restrictTo('admin'));

// ── GET /api/admin/overview ───────────────────────────────────
router.get('/overview', async (req, res) => {
  try {
    const [[{ total_doctors }]]  = await db.query(`SELECT COUNT(*) AS total_doctors  FROM users WHERE role='doctor'`);
    const [[{ total_patients }]] = await db.query(`SELECT COUNT(*) AS total_patients FROM users WHERE role='patient'`);
    const [[{ revenue }]]        = await db.query(`SELECT IFNULL(SUM(amount),0) AS revenue FROM billing WHERE MONTH(invoice_date)=MONTH(NOW())`);
    const [[{ bed_occupied }]]   = await db.query(`SELECT COUNT(*) AS bed_occupied FROM beds WHERE status='occupied'`);
    const [[{ bed_total }]]      = await db.query(`SELECT COUNT(*) AS bed_total    FROM beds`);
    const [[{ pending_invoices }]] = await db.query(`SELECT IFNULL(SUM(amount),0) AS pending_invoices FROM billing WHERE status='pending'`);

    res.json({ total_doctors, total_patients, revenue, bed_occupied, bed_total, pending_invoices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/users ──────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, full_name, email, phone, role, gender, department, created_at
         FROM users ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/admin/users ─────────────────────────────────────
// Create staff (doctor / nurse / admin)
router.post('/users', async (req, res) => {
  try {
    const { full_name, email, password, role, department } = req.body;
    if (!full_name || !email || !password || !role)
      return res.status(400).json({ message: 'All fields required.' });

    const [existing] = await db.query('SELECT id FROM users WHERE email=?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already registered.' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password, role, department) VALUES (?,?,?,?,?)`,
      [full_name, email, hashed, role, department || null]
    );
    res.status(201).json({ message: 'Staff account created.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────
router.delete('/users/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/inventory ──────────────────────────────────
router.get('/inventory', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventory ORDER BY updated_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/admin/inventory ─────────────────────────────────
router.post('/inventory', async (req, res) => {
  try {
    const { item_name, category, current_stock, unit, threshold } = req.body;
    if (!item_name)
      return res.status(400).json({ message: 'Item name is required.' });

    const [result] = await db.query(
      `INSERT INTO inventory (item_name, category, current_stock, unit, threshold)
       VALUES (?,?,?,?,?)`,
      [item_name, category || 'Consumables', current_stock || 0, unit || null, threshold || 100]
    );
    res.status(201).json({ message: 'Inventory item added.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/admin/inventory/:id ──────────────────────────────
router.put('/inventory/:id', async (req, res) => {
  try {
    const { current_stock } = req.body;
    await db.query(
      'UPDATE inventory SET current_stock=? WHERE id=?',
      [current_stock, req.params.id]
    );
    res.json({ message: 'Stock updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/admin/inventory/:id ───────────────────────────
router.delete('/inventory/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM inventory WHERE id=?', [req.params.id]);
    res.json({ message: 'Item removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/billing ────────────────────────────────────
router.get('/billing', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.full_name AS patient_full_name
         FROM billing b
         LEFT JOIN users u ON b.patient_id = u.id
        ORDER BY b.invoice_date DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/admin/billing ───────────────────────────────────
router.post('/billing', async (req, res) => {
  try {
    const { patient_name, amount, payment_method } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required.' });

    // Try to match patient by name
    const [patients] = await db.query(
      `SELECT id FROM users WHERE full_name LIKE ? AND role='patient' LIMIT 1`,
      [`%${patient_name}%`]
    );
    const patient_id = patients.length ? patients[0].id : null;

    const [result] = await db.query(
      `INSERT INTO billing (patient_id, patient_name, amount, payment_method, status)
       VALUES (?,?,?,?,'paid')`,
      [patient_id, patient_name || null, amount, payment_method || 'Cash']
    );
    res.status(201).json({ message: 'Transaction recorded.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/beds ───────────────────────────────────────
router.get('/beds', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.full_name AS patient_name
         FROM beds b
         LEFT JOIN users u ON b.patient_id = u.id
        ORDER BY b.bed_number`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/admin/beds/:id ───────────────────────────────────
router.put('/beds/:id', async (req, res) => {
  try {
    const { status, patient_id } = req.body;
    await db.query(
      'UPDATE beds SET status=?, patient_id=? WHERE id=?',
      [status, patient_id || null, req.params.id]
    );
    res.json({ message: 'Bed updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/appointments ───────────────────────────────
router.get('/appointments', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.*,
              p.full_name AS patient_name,
              d.full_name AS doctor_name
         FROM appointments a
         JOIN users p ON a.patient_id = p.id
         JOIN users d ON a.doctor_id  = d.id
        ORDER BY a.slot DESC LIMIT 100`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
