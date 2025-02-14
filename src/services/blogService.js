const API_URL = 'http://localhost:5000/api/blogs';

export const blogService = {
  async getAllBlogs() {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch blogs');
    }
    
    return response.json();
  },

  async getBlogById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch blog');
    }
    
    return response.json();
  },

  async createBlog(blogData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create blog');
    }
    
    return response.json();
  },

  async updateBlog(id, blogData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update blog');
    }
    
    return response.json();
  },

  async deleteBlog(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete blog');
    }
    
    return response.json();
  },

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
