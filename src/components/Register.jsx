import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';
import { Briefcase } from 'lucide-react';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      // Registration successful, navigate to login or auto-login
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to create account. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <div className="register-logo">
            <Briefcase size={32} color="#3B82F6" />
          </div>
          <h2>Create an Account</h2>
          <p>Join CareerFlow to track your job search.</p>
        </div>
        
        {error && <div className="register-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group half-width">
              <label>First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
              />
            </div>
            <div className="form-group half-width">
              <label>Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Create a password"
              required
            />
          </div>
          <button type="submit" className="register-button">Sign Up</button>
        </form>
        <div className="register-footer">
          <p>Already have an account? <Link to="/login" className="login-link">Sign In here</Link></p>
        </div>
      </div>
    </div>
  );
}
