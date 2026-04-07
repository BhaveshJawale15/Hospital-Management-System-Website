import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import api from './api';

function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('patient');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const getRoleData = () => {
    if (selectedRole === 'patient') return { label: 'Email Address', placeholder: 'you@example.com' };
    if (selectedRole === 'doctor')  return { label: 'Doctor Email',  placeholder: 'doctor@citycare.com' };
    if (selectedRole === 'admin')   return { label: 'Admin Email',   placeholder: 'admin@citycare.com' };
    return { label: 'Email Address', placeholder: 'you@example.com' };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email    = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const data = await api.post('/auth/login', { email, password, role: selectedRole });

      // Persist auth state
      localStorage.setItem('token',    data.token);
      localStorage.setItem('userId',   data.user.id);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userRole', data.user.role);

      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const { label, placeholder } = getRoleData();

  return (
    <div className="login-wrapper">
      {/* Banner */}
      <div className="side-banner">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Hospital Corridors"
          className="banner-img"
        />
        <div className="banner-content">
          <i className="fas fa-hospital-user main-icon"></i>
          <h1>CityCare Hospital</h1>
          <p>Your health, our priority. Access your portal securely.</p>
        </div>
      </div>

      {/* Form */}
      <div className="form-section">
        <div className="form-cont">
          <div className="mobile-logo">
            <i className="fas fa-hospital-user"></i>
            <h2>CityCare<span>+</span></h2>
          </div>

          <div className="header-text">
            <h2>Welcome Back</h2>
            <p>Please select your role and log in to continue.</p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              background: '#fee2e2', color: '#991b1b',
              padding: '10px 14px', borderRadius: '8px',
              marginBottom: '1rem', fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Role Tabs */}
          <div className="role-tabs">
            {['patient', 'doctor', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                className={`tab ${selectedRole === r ? 'active' : ''}`}
                onClick={() => { setSelectedRole(r); setError(''); }}
              >
                <i className={`fas fa-${r === 'patient' ? 'user' : r === 'doctor' ? 'user-md' : 'user-shield'}`}></i>
                {' '}{r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">{label}</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope"></i>
                <input type="email" id="email" name="email" placeholder={placeholder} required />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input type="password" id="password" name="password" placeholder="••••••••" required />
              </div>
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <div className="footer-links">
                <Link to="/forgot-password" className="forgot-pass">Forgot password?</Link>
                {selectedRole === 'patient' && (
                  <>
                    <span className="separator">|</span>
                    <Link to="/register" className="register-link">Create account</Link>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`btn-login ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
