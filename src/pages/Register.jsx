import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css'; 

function Register() {
  const navigate = useNavigate();
  
  // State for showing the success message
  const [showStatus, setShowStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get the name for localStorage as done in your original script
    const fullName = e.target.fullname.value;
    localStorage.setItem('tempUser', fullName);

    // Show the status message
    setShowStatus(true);

    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/'); // Go back to login page
    }, 2000);
  };

  return (
    <div className="register-page-root">
      {/* Status Message - Logic from your login.js */}
      {showStatus && (
        <div id="status-message" className="status-msg">
          Account Created. Now log in.
        </div>
      )}

      <div className="login-wrapper">
        <div className="side-banner">
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Hospital Corridors" 
            className="banner-img" 
          />
          <div className="banner-overlay"></div>
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
                  <input type="email" id="email" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-wrapper">
                  <i className="fas fa-phone"></i>
                  <input type="tel" id="phone" placeholder="+91 555-000-0000" required />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <div className="input-wrapper">
                    <i className="fas fa-calendar-alt"></i>
                    <input type="date" id="dob" required />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="gender">Gender</label>
                  <div className="input-wrapper">
                    <i className="fas fa-venus-mars"></i>
                    <select id="gender" required defaultValue="">
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
                  <input type="password" id="password" placeholder="••••••••" required />
                </div>
              </div>

              <div className="form-footer">
                <label className="remember-me">
                  <input type="checkbox" required /> I agree to the <a href="#" className="forgot-pass">Terms</a>
                </label>
              </div>

              <button 
                type="submit" 
                id="btn-register" 
                className={`btn-login ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Create Account"}
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