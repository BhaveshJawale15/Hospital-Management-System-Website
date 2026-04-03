import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../forgot-style.css'; 

function ForgotPassword() {
  const navigate = useNavigate();
  const [showMsg, setShowMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowMsg(true);

    // Hide message and redirect to login after 3 seconds
    setTimeout(() => {
      setShowMsg(false);
      navigate('/');
    }, 3000);
  };

  return (
    <div className="forgot-password-root">
      {/* Success Message */}
      {showMsg && (
        <div className="status-msg" style={{ display: 'block' }}>
          Reset link sent to your email!
        </div>
      )}

      <div className="register-wrapper">
        <div className="side-banner"> 
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Hospital Corridors" 
            className="banner-img" 
          /> 
          <div className="banner-overlay"></div>
          <div className="banner-content"> 
            <i className="fas fa-hospital-user main-icon"></i> 
            <h1>Account Recovery</h1> 
            <p>Don't worry, it happens to the best of us. Let's get you back into your health dashboard.</p> 
          </div> 
        </div>

        <div className="form-section">
          <div className="form-container">
            <h2>Forgot Password?</h2>
            <p className="subtitle">Enter the email address associated with your account.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input type="email" placeholder="you@example.com" required />
                </div>
              </div>

              <button type="submit" className="btn-confirm full-width">Send Reset Link</button>
              
              <div className="auth-footer">
                <p>Remember your password? <Link to="/">Log In</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;