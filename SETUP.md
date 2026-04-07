# CityCare Hospital — Full Stack Setup Guide

## Project Structure
```
hospital/
├── src/                        ← React frontend (Vite)
│   ├── api.js                  ← Central fetch helper
│   ├── App.jsx                 ← Routes + private route guard
│   └── pages/
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── ForgotPassword.jsx
│       ├── PatientDashboard.jsx
│       ├── DoctorDashboard.jsx
│       └── AdminDashboard.jsx
└── server/                     ← Node.js + Express backend
    ├── server.js               ← Entry point
    ├── db.js                   ← MySQL connection pool
    ├── middleware.js           ← JWT auth guard
    ├── schema.sql              ← Full database schema + seed data
    ├── .env                    ← Environment config
    ├── package.json
    └── routes/
        ├── auth.js             ← /api/auth/register, /api/auth/login
        ├── patient.js          ← /api/patient/*
        ├── doctor.js           ← /api/doctor/*
        └── admin.js            ← /api/admin/*
```

---

## Step 1 — MySQL Setup

Make sure MySQL 8 is installed and running.

```bash
# Log into MySQL
mysql -u root -p

# Run the schema (creates DB + all tables + seed data)
mysql -u root -p < server/schema.sql
```

Default seeded accounts:
| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| Admin  | admin@citycare.com     | Admin@123   |
| Doctor | doctor@citycare.com    | Doctor@123  |

---

## Step 2 — Configure Environment

Edit `server/.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=hospital_db
JWT_SECRET=citycare_super_secret_key_change_in_production
JWT_EXPIRES_IN=24h
```

---

## Step 3 — Start the Backend

```bash
cd server
npm install
npm run dev        # uses nodemon for auto-reload
# OR
npm start          # production
```

You should see:
```
✅  MySQL connected — hospital_db
🚀  CityCare API running → http://localhost:5000
```

---

## Step 4 — Start the Frontend

```bash
# In the root hospital/ folder
npm install
npm run dev
```

Open → http://localhost:5173

---

## API Reference

### Auth (public)
| Method | Endpoint              | Body |
|--------|-----------------------|------|
| POST   | /api/auth/register    | full_name, email, phone, password, gender, dob |
| POST   | /api/auth/login       | email, password, role |

### Patient (requires Bearer token, role: patient)
| Method | Endpoint                      |
|--------|-------------------------------|
| GET    | /api/patient/profile          |
| PUT    | /api/patient/profile          |
| GET    | /api/patient/appointments     |
| POST   | /api/patient/appointments     |
| GET    | /api/patient/records          |
| GET    | /api/patient/prescriptions    |
| GET    | /api/patient/lab-reports      |
| GET    | /api/patient/billing          |

### Doctor (requires Bearer token, role: doctor)
| Method | Endpoint                        |
|--------|---------------------------------|
| GET    | /api/doctor/queue               |
| GET    | /api/doctor/appointments        |
| PUT    | /api/doctor/appointments/:id    |
| GET    | /api/doctor/records             |
| POST   | /api/doctor/records             |
| POST   | /api/doctor/prescriptions       |
| GET    | /api/doctor/patients            |
| GET    | /api/doctor/schedule            |

### Admin (requires Bearer token, role: admin)
| Method | Endpoint                  |
|--------|---------------------------|
| GET    | /api/admin/overview       |
| GET    | /api/admin/users          |
| POST   | /api/admin/users          |
| DELETE | /api/admin/users/:id      |
| GET    | /api/admin/inventory      |
| POST   | /api/admin/inventory      |
| PUT    | /api/admin/inventory/:id  |
| DELETE | /api/admin/inventory/:id  |
| GET    | /api/admin/billing        |
| POST   | /api/admin/billing        |
| GET    | /api/admin/beds           |
| PUT    | /api/admin/beds/:id       |
| GET    | /api/admin/appointments   |

---

## Common Issues

**MySQL connection refused**
- Make sure MySQL service is running: `sudo service mysql start`
- Double-check DB_PASSWORD in `.env`

**CORS error in browser**
- Confirm backend is running on port 5000
- Confirm frontend is running on port 5173 (Vite default)

**Token expired / 401 errors**
- Log out and log back in — JWT lasts 24h by default

**"No doctor available" when booking**
- At least one doctor account must exist in the DB
- Run the schema.sql seed or create a doctor via Admin panel
