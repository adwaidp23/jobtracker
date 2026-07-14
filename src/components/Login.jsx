import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { Briefcase } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('testuser@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
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
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email (Username)</label>
            <input 
              type="text" 
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
        <div className="login-footer" style={{textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-light)"}}>
          <p>Don't have an account? <Link to="/register" style={{color: "var(--primary-blue)", textDecoration: "none", fontWeight: "500"}}>Sign Up here</Link></p>
        </div>
      </div>
    </div>
  );
}
