import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/BlogForm.css';

const BlogEdit = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const { title, content } = response.data;
      setTitle(title);
      setContent(content);
    } catch (err) {
      setError('Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, {
        title,
        content
      }, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog post');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="blog-form-container">Loading...</div>;
  }

  return (
    <div className="blog-form-container">
      <h2>Edit Blog Post</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-control"
            rows="10"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
};

export default BlogEdit;
