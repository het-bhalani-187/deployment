import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo8.jpg';
import '../styles/Navbar.css';

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Add API call to delete account here
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const renderAuthLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/login" className="navbar-item">Login</Link>
          <Link to="/signup" className="navbar-item">Sign Up</Link>
        </>
      );
    }

    return (
      <div className="profile-menu-container">
        <button className="profile-menu-button" onClick={toggleProfileMenu}>
          Profile
          <span className="profile-menu-arrow"></span>
        </button>
        {showProfileMenu && (
          <div className="profile-dropdown">
            <Link to="/profile" className="dropdown-item">View Profile</Link>
            <button onClick={handleDeleteAccount} className="dropdown-item delete-account">
              Delete Account
            </button>
            <button onClick={handleLogout} className="dropdown-item">
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderRoleBasedLinks = () => {
    if (!user) return null;

    const role = user.role?.toLowerCase() || '';
    const links = [];

    // Common links for all authenticated users
    links.push(
      <Link key="features" to="/features" className="navbar-item">Features</Link>,
      <Link key="promptbar" to="/promptbar" className="navbar-item">Prompt Bar</Link>
    );

    // Role-specific links
    if (role === 'civilian' || role === 'lawstudent' || role === 'lawyer') {
      links.push(
        <Link key="courtroom" to="/courtroom" className="navbar-item">Court Room</Link>
      );
    }

    if (role === 'lawstudent' || role === 'lawyer') {
      links.push(
        <Link key="blog" to="/blog" className="navbar-item">Blog</Link>,
        // <Link key="create-blog" to="/create-blog" className="navbar-item">Create Blog</Link>
      );
    }

    return <>{links}</>;
};

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>
      
      <button className="navbar-toggle" onClick={toggleMenu}>
        <span className="navbar-toggle-icon"></span>
      </button>

      <div className={`navbar-menu ${isOpen ? 'is-open' : ''}`}>
        <Link to="/dashboard" className="navbar-item">Home</Link>
        {!user && <Link to="/features" className="navbar-item">Features</Link>}
        {renderRoleBasedLinks()}
        <Link to="/aboutus" className="navbar-item">About Us</Link>
        {renderAuthLinks()}
      </div>
    </nav>
  );
};

export default Navbar1;