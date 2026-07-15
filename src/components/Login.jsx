import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, sessionExpired, setSessionExpired } = useAuth();
  const navigate = useNavigate();

  // Listen for the auth:session-expired event fired by the axios interceptor
  useEffect(() => {
    const handler = () => setSessionExpired(true);
    window.addEventListener('auth:session-expired', handler);
    return () => window.removeEventListener('auth:session-expired', handler);
  }, [setSessionExpired]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSessionExpired(false);
    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">
            <span className="material-symbols-outlined logo-icon">architecture</span>
          </div>
          <h2>CareerArch</h2>
          <p>Sign in to manage your professional journey</p>
        </div>

        {sessionExpired && (
          <div className="login-banner login-banner--warning">
            <span className="material-symbols-outlined">error</span>
            <span>Your session expired. Please log in again.</span>
          </div>
        )}

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">mail</span>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="password-header">
              <label>PASSWORD</label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <span className="material-symbols-outlined input-icon">lock</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <span className="material-symbols-outlined input-icon-right">visibility</span>
            </div>
          </div>

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me for 30 days</label>
          </div>

          <button type="submit" className="login-button">
            Sign In 
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </form>

        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-login">
          <button className="social-btn">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="social-icon" />
            Google
          </button>
          <button className="social-btn">
            <img src="https://www.linkedin.com/favicon.ico" alt="LinkedIn" className="social-icon" />
            LinkedIn
          </button>
        </div>

        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="signup-link">Sign up</Link></p>
        </div>
      </div>
      
      <div className="secure-badge">
        <span className="material-symbols-outlined">verified_user</span>
        Secure Enterprise-Grade Encryption
      </div>
    </div>
  );
}
