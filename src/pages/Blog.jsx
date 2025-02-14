import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from "react-router-dom"; 
import "../styles/Blog.css"; 

const API_BASE_URL = 'http://localhost:5000';

const BlogCard = ({ title, description, author, date, id }) => (
  <div className="blog-card">
    <div className="blog-content">
      <h3>{title}</h3>
      <p className="blog-description">{description}</p>
      <div className="blog-meta">
        <span>By {author}</span>
        <span>{date}</span>
      </div>
      <Link to={`/blog/${id}`} className="read-more">Read More</Link>
    </div>
  </div>
);

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please log in to view blogs');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          setBlogs(response.data.data || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch blogs');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          logout();
          navigate('/login');
          return;
        }

        if (err.response?.status === 403) {
          setError('Please verify your email to access blogs.');
          return;
        }

        setError(err.response?.data?.message || 'Failed to fetch blogs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBlogs();
    } else {
      setError('Please log in to view blogs');
      setLoading(false);
    }
  }, [user, logout, navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="blog-container">
        <div className="loading">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-container">
        <div className="error-message">
          <p>{error}</p>
          {!error.includes('session has expired') && !error.includes('Please log in') && (
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Try Again
            </button>
          )}
          {(error.includes('session has expired') || error.includes('Please log in')) && (
            <Link to="/login" className="login-button">
              Go to Login
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      {user?.role === 'lawyer' && (
        <div className="create-blog-section">
          <Link to="/blog/create" className="create-blog-button">
            Create New Blog
          </Link>
        </div>
      )}
      
      <div className="blogs-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              id={blog._id}
              title={blog.title}
              description={blog.content.substring(0, 200) + '...'}
              author={blog.author?.name || 'Unknown Author'}
              date={formatDate(blog.createdAt)}
            />
          ))
        ) : (
          <div className="no-blogs-message">
            No blogs available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;