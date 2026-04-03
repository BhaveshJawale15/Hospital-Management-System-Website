import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css'; // Ensure this file is in your src or pages folder

function Login() {
  const navigate = useNavigate();
  
  // State to manage the selected role (replaces your selectRole JS function)
  const [selectedRole, setSelectedRole] = useState('patient');
  const [loading, setLoading] = useState(false);

  // Logic to handle role changes (updates labels and placeholders)
  const getRoleData = () => {
    if (selectedRole === 'patient') return { label: "Email Address", placeholder: "you@example.com" };
    if (selectedRole === 'doctor') return { label: "Doctor ID", placeholder: "Enter your Doctor ID" };
    if (selectedRole === 'admin') return { label: "Admin ID", placeholder: "Enter Admin Credentials" };
    return { label: "Email Address", placeholder: "you@example.com" };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mimicking your login.js timeout logic
    setTimeout(() => {
      // Navigate based on selectedRole
      navigate(`/${selectedRole}`);
    }, 1200);
  };

  const { label, placeholder } = getRoleData();

  return (
    <div className="login-wrapper">
      {/* Banner Section */}
      <div className="side-banner">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Hospital Corridors" 
          className="banner-img" 
        />
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <i className="fas fa-hospital-user main-icon"></i>
          <h1>CityCare Hospital</h1>
          <p>Your health, our priority. Access your portal securely.</p>
        </div>
      </div>

      {/* Form Section */}
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

          {/* Role Tabs */}
          <div className="role-tabs">
            <button 
              type="button" 
              className={`tab ${selectedRole === 'patient' ? 'active' : ''}`}
              onClick={() => setSelectedRole('patient')}
            >
              <i className="fas fa-user"></i> Patient
            </button>
            <button 
              type="button" 
              className={`tab ${selectedRole === 'doctor' ? 'active' : ''}`}
              onClick={() => setSelectedRole('doctor')}
            >
              <i className="fas fa-user-md"></i> Doctor
            </button>
            <button 
              type="button" 
              className={`tab ${selectedRole === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedRole('admin')}
            >
              <i className="fas fa-user-shield"></i> Admin
            </button>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">{label}</label>
              <div className="input-wrapper">
                <i className="fas fa-envelope"></i>
                <input type="text" id="email" placeholder={placeholder} required />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <i className="fas fa-lock"></i>
                <input type="password" id="password" placeholder="••••••••" required />
              </div>
            </div>

            <div className="form-footer">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <div className="footer-links">
                {/* Use Link instead of <a> to keep it a Single Page App */}
                <Link to="/forgot-password" title="Forgot password?" className="forgot-pass">Forgot password?</Link>
                
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
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;