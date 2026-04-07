-- ============================================================
--  CityCare Hospital — Full Database Schema
--  Run this once: mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS hospital_db;
USE hospital_db;

-- ─── USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  full_name    VARCHAR(120)  NOT NULL,
  email        VARCHAR(120)  NOT NULL UNIQUE,
  phone        VARCHAR(20),
  password     VARCHAR(255)  NOT NULL,         -- bcrypt hash
  role         ENUM('patient','doctor','admin') NOT NULL DEFAULT 'patient',
  gender       ENUM('male','female','other'),
  dob          DATE,
  department   VARCHAR(100),                   -- for doctors
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── PASSWORD RESETS (NEW) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS password_resets (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  email        VARCHAR(120) NOT NULL,
  token        VARCHAR(255) NOT NULL,         -- A unique string
  expires_at   DATETIME NOT NULL,             -- 1 hour expiry
  status       ENUM('pending', 'used', 'expired') DEFAULT 'pending',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);

-- ─── APPOINTMENTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  patient_id   INT NOT NULL,
  doctor_id    INT NOT NULL,
  dept         VARCHAR(100),
  slot         DATETIME NOT NULL,
  status       ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  notes        TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id)  REFERENCES users(id)
);

-- ─── MEDICAL RECORDS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medical_records (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  patient_id   INT NOT NULL,
  doctor_id    INT NOT NULL,
  record_type  VARCHAR(100),
  diagnosis    TEXT,
  description  TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id)  REFERENCES users(id)
);

-- ─── PRESCRIPTIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS prescriptions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  patient_id   INT NOT NULL,
  doctor_id    INT NOT NULL,
  medicine     VARCHAR(200) NOT NULL,
  dosage       VARCHAR(200),
  instructions TEXT,
  issued_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id)  REFERENCES users(id)
);

-- ─── LAB REPORTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lab_reports (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  patient_id   INT NOT NULL,
  test_name    VARCHAR(200) NOT NULL,
  result       VARCHAR(200),
  status       ENUM('pending','final') DEFAULT 'pending',
  report_date  DATE,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id)
);

-- ─── BILLING ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS billing (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  patient_id     INT,
  patient_name   VARCHAR(120),
  amount         DECIMAL(10,2) NOT NULL,
  payment_method ENUM('UPI','Cash','Card','Insurance') DEFAULT 'Cash',
  status         ENUM('paid','pending','overdue') DEFAULT 'pending',
  invoice_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ─── INVENTORY ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inventory (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  item_name     VARCHAR(200) NOT NULL,
  category      ENUM('Consumables','Medical Gas','Medicine','Equipment') DEFAULT 'Consumables',
  current_stock INT NOT NULL DEFAULT 0,
  unit          VARCHAR(100),
  threshold     INT DEFAULT 100,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─── BEDS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS beds (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  bed_number VARCHAR(20) NOT NULL,
  ward       VARCHAR(100) DEFAULT 'Ward A',
  status     ENUM('occupied','vacant','cleaning') DEFAULT 'vacant',
  patient_id INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ─── SEED DATA ──────────────────────────────────────────────
-- Default admin (Password: Admin@123)
INSERT IGNORE INTO users (full_name, email, password, role) VALUES
('Admin User', 'admin@citycare.com', 
 '$2b$10$Y5bsOVgxb5GtHjv1q1P3IOQVy0GwHZJ9qY1YP/cRiJIlKXn7j0jJe', 'admin');

-- Default doctor (Password: Doctor@123)
INSERT IGNORE INTO users (full_name, email, password, role, department) VALUES
('Dr. Smith', 'doctor@citycare.com', 
 '$2b$10$R9h/lIPzHZlu60bkTJ4mre79TPhq.R5Qo6N5fGk8Vf5q6F.V6uScy', 'doctor', 'Cardiology');

-- Sample inventory
INSERT IGNORE INTO inventory (item_name, category, current_stock, unit, threshold) VALUES
('Surgical Masks',   'Consumables', 240,  'Box (50pcs)', 500),
('Paracetamol 650mg','Medicine',    1200, 'Strip',       200),
('Oxygen Cylinders', 'Medical Gas', 15,   'Cylinder',    10),
('Surgical Gloves',  'Consumables', 800,  'Box (100pcs)',300);

-- Sample beds
INSERT IGNORE INTO beds (bed_number, ward, status) VALUES
('101','Ward A','occupied'),('102','Ward A','occupied'),
('103','Ward A','vacant'),  ('104','Ward A','occupied'),
('105','Ward A','vacant'),  ('106','Ward A','vacant'),
('107','Ward A','occupied'),('108','Ward A','cleaning');