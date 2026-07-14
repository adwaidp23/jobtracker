import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { Briefcase, AlertCircle } from 'lucide-react';

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
            <Briefcase size={32} color="#3B82F6" />
          </div>
          <h2>CareerFlow</h2>
          <p>Welcome back! Please login to your account.</p>
        </div>

        {sessionExpired && (
          <div className="login-banner login-banner--warning">
            <AlertCircle size={16} />
            <span>Your session expired. Please log in again.</span>
          </div>
        )}

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">Sign In</button>
        </form>
        <div className="login-footer" style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <p>Don&apos;t have an account? <Link to="/register" style={{ color: 'var(--primary-blue)', textDecoration: 'none', fontWeight: '500' }}>Sign Up here</Link></p>
        </div>
      </div>
    </div>
  );
}
