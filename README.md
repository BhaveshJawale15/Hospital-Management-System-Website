# Hospital Management System Website

A responsive, role-based Hospital Management System web application designed to simplify hospital workflows, manage user access, and handle appointments and medical records efficiently.

---

## 📌 Project Overview

The **Hospital Management System** provides a centralized platform for healthcare administration. It connects administrators, medical staff, and patients through dedicated role-based portals, streamlining daily hospital operations such as patient registration, doctor schedules, and record maintenance.

---

## ✨ Features

- **Role-Based Portals:**
  - **Admin Dashboard:** Oversee system operations, manage doctor profiles, and review hospital metrics.
  - **Doctor Dashboard:** View appointment schedules, check patient lists, and manage consultations.
  - **Patient Dashboard:** Register accounts, book and view appointment statuses, and access medical details.
- **Authentication & Security:** Secure user login, account registration, and password recovery (`ForgotPassword`).
- **API Integration:** Client-side communication configured via dedicated API modules (`api.js`) for data retrieval and updates.
- **Responsive Interface:** Clean, mobile-friendly dashboards styled with modular CSS for smooth user interaction.

---

## 🛠️ Technologies Used

- **Frontend:** React.js (`JSX`), JavaScript (ES6+), HTML5, CSS3
- **Build Tool:** Vite
- **Styling:** Custom Modular CSS (`dashboard-style.css`, `login.css`, `forgot-style.css`)
- **Version Control:** Git, GitHub

---

## 📁 Project Structure

```text
Hospital-Management-System-Website/
└── client/
    ├── src/
    │   ├── AdminDashboard.jsx
    │   ├── App.jsx
    │   ├── DoctorDashboard.jsx
    │   ├── ForgotPassword.jsx
    │   ├── Login.jsx
    │   ├── PatientDashboard.jsx
    │   ├── Register.jsx
    │   ├── api.js
    │   ├── dashboard-style.css
    │   ├── forgot-style.css
    │   ├── login.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── package-lock.json
```

💻 Usage Instructions
Registration / Login: Start by visiting the registration or login page to authenticate as an Admin, Doctor, or Patient.

Dashboard Navigation: Once signed in, you will be directed to your specific dashboard (AdminDashboard, DoctorDashboard, or PatientDashboard).

Password Recovery: If needed, use the Forgot Password link on the sign-in screen to initiate account recovery.

👥 Contributors
Bhavesh Jawale – GitHub

College Project Teammates
