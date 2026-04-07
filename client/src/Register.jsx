import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';
import api from './api';

function Register() {
  const navigate = useNavigate();
  const [showStatus, setShowStatus]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const payload = {
      full_name : e.target.fullname.value.trim(),
      email     : e.target.email.value.trim(),
      phone     : e.target.phone.value.trim(),
      password  : e.target.password.value,
      gender    : e.target.gender.value,
      dob       : e.target.dob.value,
    };

    try {
      const data = await api.post('/auth/register', payload);

      // Auto-login after register
      localStorage.setItem('token',    data.token);
      localStorage.setItem('userId',   data.user.id);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userRole', data.user.role);

      setShowStatus(true);
      setTimeout(() => navigate('/patient'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page-root">
      {showStatus && (
        <div className="status-msg">Account Created. Taking you to dashboard…</div>
      )}

      <div className="login-wrapper">
        <div className="side-banner">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Hospital Corridors"
            className="banner-img"
          />
          <div className="banner-content">
            <i className="fas fa-hospital-user main-icon"></i>
            <h1>Join CityCare</h1>
            <p>Start your journey towards better health management today.</p>
          </div>
        </div>

        <div className="form-section">
          <div className="form-cont">
            <div className="header-text">
              <h2>Create Account</h2>
              <p>Enter your details to register as a new patient.</p>
            </div>

            {error && (
              <div style={{
                background: '#fee2e2', color: '#991b1b',
                padding: '10px 14px', borderRadius: '8px',
                marginBottom: '1rem', fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}

            <form id="register-form" className="login-form" onSubmit={handleRegister}>
              <div className="input-group">
                <label htmlFor="fullname">Full Name</label>
                <div className="input-wrapper">
                  <i className="fas fa-user"></i>
                  <input type="text" id="fullname" name="fullname" placeholder="John Doe" required />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <i className="fas fa-envelope"></i>
                  <input type="email" id="email" name="email" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-wrapper">
                  <i className="fas fa-phone"></i>
                  <input type="tel" id="phone" name="phone" placeholder="+91 555-000-0000" required />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <div className="input-wrapper">
                    <i className="fas fa-calendar-alt"></i>
                    <input type="date" id="dob" name="dob" required />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="gender">Gender</label>
                  <div className="input-wrapper">
                    <i className="fas fa-venus-mars"></i>
                    <select id="gender" name="gender" required defaultValue="">
                      <option value="" disabled>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Create Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock"></i>
                  <input type="password" id="password" name="password" placeholder="••••••••" required />
                </div>
              </div>

              <div className="form-footer">
                <label className="remember-me">
                  <input type="checkbox" required /> I agree to the{' '}
                  <a href="#" className="forgot-pass">Terms</a>
                </label>
              </div>

              <button
                type="submit"
                className={`btn-login ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="switch-form">
                Already have an account? <Link to="/">Log In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
