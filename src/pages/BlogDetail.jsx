import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/BlogDetail.css';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBlogPost();
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(response.data);
    } catch (err) {
      setError('Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        navigate('/blog');
      } catch (err) {
        setError('Failed to delete blog post');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="blog-detail-container">Loading...</div>;
  }

  if (error) {
    return <div className="blog-detail-container">{error}</div>;
  }

  if (!blog || !blog.content) {
    return <div className="blog-detail-container">Blog post not found</div>;
  }

  const isAuthor = user && blog.author === user.id;

  return (
    <div className="blog-detail-container">
      <div className="blog-header">
        <h1>{blog.title}</h1>
        <div className="blog-meta">
          <span>By {blog.authorName || 'Unknown Author'}</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
      </div>

      <div className="blog-content">
        {(blog.content || '').split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      {isAuthor && (
        <div className="blog-actions">
          <Link to={`/blog/edit/${id}`} className="edit-button">Edit</Link>
          <button onClick={handleDelete} className="delete-button">Delete</button>
        </div>
      )}

      <Link to="/blog" className="back-button">Back to Blogs</Link>
    </div>
  );
};

export default BlogDetail;
