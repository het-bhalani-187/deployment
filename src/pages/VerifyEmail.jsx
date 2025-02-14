import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import '../styles/VerifyEmail.css';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const verificationComplete = useRef(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const verifyEmail = async (retryAttempt = 0) => {
    if (verificationComplete.current) {
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    try {
      console.log(`Verification attempt ${retryAttempt + 1} with token:`, token);
      const response = await axios.get(
        `http://localhost:5000/api/auth/verify/${token}`
      );

      console.log('Verification response:', response.data);

      if (response.data.status === 'success') {
        verificationComplete.current = true;
        setStatus('success');
        setMessage(response.data.message);
        
        // Get email from localStorage
        const email = localStorage.getItem('pendingVerificationEmail');
        if (email) {
          setVerifiedEmail(email);
          localStorage.removeItem('pendingVerificationEmail');
        }
        
        // Update user verification status in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          userData.verified = true;
          localStorage.setItem('user', JSON.stringify(userData));
        }

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Verification error:', err.response || err);
      
      const email = localStorage.getItem('pendingVerificationEmail');
      if (email) {
        setVerifiedEmail(email);
      }

      if (!verificationComplete.current && 
          retryAttempt < MAX_RETRIES && 
          (!err.response || err.response.status === 500 || err.response.status === 404)) {
        console.log(`Retrying verification in ${RETRY_DELAY}ms...`);
        setMessage(`Verifying your email... Attempt ${retryAttempt + 1} of ${MAX_RETRIES}`);
        setTimeout(() => verifyEmail(retryAttempt + 1), RETRY_DELAY);
        return;
      }

      if (!verificationComplete.current) {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 
          'Verification failed. Please try again or contact support.'
        );
      }
    }
  };

  useEffect(() => {
    verifyEmail(0);
    return () => {
      verificationComplete.current = true;
    };
  }, [token]);

  return (
    <div className="verify-email-container">
      <div className="verify-email-box">
        {status === 'verifying' && (
          <>
            <FaSpinner className="spinner" />
            <h2>Verifying Your Email</h2>
            <p>{message || 'Please wait while we verify your email address...'}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="success-icon" />
            <h2>Email Verified!</h2>
            <p>{message}</p>
            {verifiedEmail && <p>Verified email: {verifiedEmail}</p>}
            <p>Redirecting to login page...</p>
            <div className="auth-links">
              <Link to="/login">Click here if not redirected</Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <FaExclamationCircle className="error-icon" />
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <div className="auth-links">
              <Link to="/login">Back to Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
