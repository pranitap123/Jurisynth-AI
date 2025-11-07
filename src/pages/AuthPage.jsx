import React, { useState } from 'react';
import { FaUser, FaGavel, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
// 1. Import the Google Login button and jwt-decode
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userType, setUserType] = useState('user');
  const navigate = useNavigate();

  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // 2. Add the Google Login success handler
  const handleGoogleSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // Decode the credential to get user's name and email
    const decoded = jwtDecode(credentialResponse.credential);
    const userName = decoded.name;
    const userEmail = decoded.email;

    console.log("Google Login Success!");
    console.log("Name:", userName);
    console.log("Email:", userEmail);

    // Save the user's name to Local Storage
    localStorage.setItem('loggedInUserName', userName);

    // TODO: Send this 'credentialResponse.credential' to your backend for verification

    alert(`Welcome, ${userName}! You are logged in.`);
    navigate('/dashboard'); // Redirect to dashboard
  };

  const handleGoogleError = () => {
    console.log('Login Failed');
    alert('Google Login failed. Please try again.');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // For testing, we'll just use the email as the name if it's not a full name
    // In a real app, your API would return the user's full name
    const loggedInName = email.split('@')[0]; // Simple name from email
    localStorage.setItem('loggedInUserName', loggedInName);
    
    alert('Login successful! Redirecting to dashboard...');
    navigate('/dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('loggedInUserName', name); // Save the full name
    alert('Registration successful! Redirecting to dashboard...');
    navigate('/dashboard');
  };

  // Helper to switch modes and clear form fields
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-page-layout">
      {/* Left Branding Panel */}
      <div className="auth-branding-panel">
        <Link to="/" className="branding-logo">
          Jurisynth
        </Link>
        <div className="branding-content">
          <div className="branding-icon">
            <FaGavel />
          </div>
          <h2>A Smarter Way to Practice Law</h2>
          <p>
            Turn thousands of pages of case documents into searchable,
            summarized, and actionable insights in minutes.
          </p>
        </div>
        <div>{/* Empty div for bottom spacing */}</div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-card animate-fade-in-up">
          <h2>{isLoginMode ? 'Welcome Back' : 'Create Your Account'}</h2>
          
          {/* 3. Add the Google Login Button here */}
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline" // Use 'filled_blue' or 'outline'
              size="large"
              shape="rectangular"
              width="100%" // Make it fill the container
            />
          </div>
          
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {isLoginMode ? (
            /* === LOGIN FORM === */
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">
                  <FaLock /> Password
                </label>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
              <p className="auth-toggle">
                Don't have an account?{' '}
                <button type="button" onClick={toggleMode}>
                  Register
                </button>
              </p>
            </form>
          ) : (
            /* === REGISTER FORM === */
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="register-name">
                  <FaUser /> Full Name
                </label>
                <input
                  type="text"
                  id="register-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-email">
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  id="register-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-password">
                  <FaLock /> Password
                </label>
                <input
                  type="password"
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* User Type Toggle */}
              <label className="auth-label">I am a:</label>
              <div className="user-type-toggle">
                <label className={userType === 'user' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="userType"
                    value="user"
                    checked={userType === 'user'}
                    onChange={() => setUserType('user')}
                  />
                  <FaUser /> User
                </label>
                <label className={userType === 'advocate' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="userType"
                    value="advocate"
                    checked={userType === 'advocate'}
                    onChange={() => setUserType('advocate')}
                  />
                  <FaGavel /> Advocate
                </label>
              </div>

              <button type="submit" className="btn btn-primary">
                Create Account
              </button>
              <p className="auth-toggle">
                Already have an account?{' '}
                <button type="button" onClick={toggleMode}>
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;