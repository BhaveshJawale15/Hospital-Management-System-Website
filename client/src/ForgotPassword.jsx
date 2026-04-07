import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './forgot-style.css'; 
import api from './api'; //

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: New Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showToast = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // Step 1: Request Reset (Verify Email exists)
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // We'll create this endpoint in the backend
      await api.post('/auth/verify-email', { email });
      setStep(2);
      showToast("Email verified. Please set your new password.");
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Update Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, newPassword: password });
      showToast("Password updated successfully! Redirecting...");
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-root">
      {message.text && (
        <div className={`status-msg ${message.type}`} style={{ display: 'block' }}>
          {message.text}
        </div>
      )}

      <div className="register-wrapper">
        <div className="side-banner"> 
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Hospital Corridors" 
            className="banner-img" 
          /> 
          <div className="banner-content"> 
            <i className="fas fa-key main-icon"></i> 
            <h1>{step === 1 ? 'Account Recovery' : 'Secure Account'}</h1> 
            <p>{step === 1 
              ? "Enter your email to verify your identity." 
              : "Choose a strong password you haven't used before."}
            </p> 
          </div> 
        </div>

        <div className="form-section">
          <div className="form-container">
            <h2>{step === 1 ? 'Forgot Password?' : 'Reset Password'}</h2>
            
            {step === 1 ? (
              <form className="auth-form" onSubmit={handleVerifyEmail}>
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <i className="fas fa-envelope"></i>
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <button type="submit" className="btn-confirm full-width" disabled={loading}>
                  {loading ? 'Checking...' : 'Verify Email'}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleResetPassword}>
                <div className="input-group">
                  <label>New Password</label>
                  <div className="input-with-icon">
                    <i className="fas fa-lock"></i>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      minLength="6"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-confirm full-width" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}

            <div className="auth-footer">
              <p>Remembered? <Link to="/">Log In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;