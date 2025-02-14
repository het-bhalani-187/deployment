import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token) {
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      fetchUser(token);
    }
    setLoading(false);
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error('Error fetching user:', err);
      if (err.response?.status === 401) {
        logout(); // Token is invalid, log out the user
      }
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, data: { user } } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return user;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Permission checks
  const canAccessPromptBar = () => {
    return user && user.verified;
  };

  const canPostBlog = () => {
    return user && user.verified && user.role === 'lawyer';
  };

  const canReplyInCourtroom = () => {
    return user && user.verified && (user.role === 'lawyer' || user.role === 'law_student');
  };

  const canViewBlog = () => {
    return user && user.verified;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    canAccessPromptBar,
    canPostBlog,
    canReplyInCourtroom,
    canViewBlog
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
