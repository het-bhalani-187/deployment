import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import logo from '../assets/images/logo8.jpg';

const API_BASE_URL = 'http://localhost:5000';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setRequiresVerification(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      console.log('Login response:', response.data);

      if (response.data.status === 'success') {
        // Store token and user data
        login(response.data.token, response.data.data.user);
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data);
      if (err.response?.data?.requiresVerification) {
        setRequiresVerification(true);
        localStorage.setItem('pendingVerificationEmail', email);
        setError('Please verify your email before logging in. Check your inbox for the verification link.');
      } else {
        setError(err.response?.data?.message || 'Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/auth/resend-verification`, {
        email
      });

      if (response.data.status === 'success') {
        setError('Verification email sent! Please check your inbox.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={logo} alt="LawAI Logo" className="auth-logo" />
        <h2>Login</h2>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            {requiresVerification && (
              <button 
                onClick={handleResendVerification}
                className="link-button"
                disabled={loading}
              >
                Resend Verification Email
              </button>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>

        <div className="auth-links">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;