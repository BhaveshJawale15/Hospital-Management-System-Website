import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import AdminDashboard from './AdminDashboard';

// ── Simple route guard ────────────────────────────────────────
function PrivateRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const role  = localStorage.getItem('userRole');
  if (!token) return <Navigate to="/" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/patient" element={
          <PrivateRoute allowedRole="patient">
            <PatientDashboard />
          </PrivateRoute>
        } />

        <Route path="/doctor" element={
          <PrivateRoute allowedRole="doctor">
            <DoctorDashboard />
          </PrivateRoute>
        } />

        <Route path="/admin" element={
          <PrivateRoute allowedRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
