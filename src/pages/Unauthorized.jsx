import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Access Denied</h2>
        <div className="message error">
          You don't have permission to access this page.
        </div>
        
        {user ? (
          <div className="verification-instructions">
            {!user.verified ? (
              <>
                <p>Your account needs to be verified to access this feature.</p>
                <p>Please check your email for the verification link.</p>
              </>
            ) : (
              <p>This feature is not available for {user.role} accounts.</p>
            )}
          </div>
        ) : (
          <div className="verification-instructions">
            <p>Please log in to access this feature.</p>
          </div>
        )}

        <div className="auth-link">
          <Link to="/">Return to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
