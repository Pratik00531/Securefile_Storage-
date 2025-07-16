import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 160px)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <UserPlus size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              margin: '0 0 0.5rem 0'
            }}>
              Create Account
            </h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Join our secure platform
            </p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                <User size={16} style={{ marginRight: '0.5rem' }} />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ marginRight: '0.5rem' }} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                <Lock size={16} style={{ marginRight: '0.5rem' }} />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                <Lock size={16} style={{ marginRight: '0.5rem' }} />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#64748b', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;