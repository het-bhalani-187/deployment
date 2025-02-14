import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.css';
import logo from '../assets/images/logo8.jpg';
import { toast } from 'react-toastify';

const MIN_LAWYER_EXPERIENCE = 2;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'civilian',
    // Lawyer specific fields
    specialization: '',
    experience: '',
    barCouncilId: '',
    // Law student specific fields
    universityName: '',
    studentId: '',
    yearOfStudy: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const specializations = [
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Corporate Law',
    'Property Law',
    'Immigration Law',
    'General Practice'
  ];

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.role === 'lawyer') {
      if (!formData.specialization) {
        setError('Please select your specialization');
        return false;
      }
      if (!formData.experience || formData.experience < 0) {
        setError('Please provide valid years of experience');
        return false;
      }
    }

    if (formData.role === 'law_student') {
      if (!formData.universityName || !formData.studentId || !formData.yearOfStudy) {
        setError('Please fill in all law student-specific fields');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      
      if (response.data.status === 'success') {
        // Store email for verification
        localStorage.setItem('pendingVerificationEmail', formData.email);
        setVerificationSent(true);
        // toast.success('Signup successful! Please log in.');
        // navigate('/login');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during signup';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <img src={logo} alt="LawAI Logo" className="auth-logo" />
          <h2>Verification Email Sent</h2>
          <div className="verification-message">
            <p>We've sent a verification link to your email address: <strong>{formData.email}</strong></p>
            <p>Please check your email and click the verification link to complete your registration.</p>
            <p>If you don't see the email, please check your spam folder.</p>
          </div>
          <div className="auth-links">
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={logo} alt="LawAI Logo" className="auth-logo" />
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="civilian">Civilian</option>
              <option value="lawyer">Lawyer</option>
              <option value="law_student">Law Student</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          {formData.role === 'lawyer' && (
            <div className="lawyer-fields">
              <div className="form-group">
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="barCouncilId"
                  placeholder="Bar Council ID"
                  value={formData.barCouncilId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="experience"
                  placeholder="Years of Experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  required
                />
                {formData.experience < MIN_LAWYER_EXPERIENCE && (
                  <div className="experience-warning">
                    Note: You need at least {MIN_LAWYER_EXPERIENCE} years of experience to answer questions in the courtroom
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.role === 'law_student' && (
            <div className="student-fields">
              <div className="form-group">
                <input
                  type="text"
                  name="universityName"
                  placeholder="University Name"
                  value={formData.universityName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="studentId"
                  placeholder="Student ID"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  name="yearOfStudy"
                  placeholder="Year of Study"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;