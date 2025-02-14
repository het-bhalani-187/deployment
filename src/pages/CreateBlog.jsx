import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/CreateBlog.css';

const API_BASE_URL = 'http://localhost:5000';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Create axios instance with auth header
  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'lawyer') {
      setError('Only lawyers can create blogs');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await authAxios.post('/api/blogs', {
        title: title.trim(),
        content: content.trim()
      });

      if (response.data.status === 'success') {
        navigate('/blog');
      } else {
        throw new Error(response.data.message || 'Failed to create blog');
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to create blog. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-form">
        <h2>Create New Blog</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content here..."
              rows="10"
              required
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              onClick={() => navigate('/blog')}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
