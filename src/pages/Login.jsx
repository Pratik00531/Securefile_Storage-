import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
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

    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError('');
    setForgotPasswordMessage('');

    try {
      const response = await authAPI.forgotPassword(forgotPasswordEmail);
      setForgotPasswordMessage(response.data.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordMessage('');
        setForgotPasswordEmail('');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to send password reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  if (showForgotPassword) {
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
              <Mail size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                margin: '0 0 0.5rem 0'
              }}>
                Forgot Password
              </h1>
              <p style={{ color: '#64748b', margin: 0 }}>
                Enter your email to reset your password
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {forgotPasswordMessage && (
              <div className="alert alert-success">
                <CheckCircle size={16} />
                {forgotPasswordMessage}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} style={{ marginRight: '0.5rem' }} />
                  Email
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={forgotPasswordLoading}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                {forgotPasswordLoading ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '0.5rem' }}></div>
                    Sending...
                  </>
                ) : (
                  'Send Reset Email'
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowForgotPassword(false)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#3b82f6', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <LogIn size={48} style={{ color: '#3b82f6', marginBottom: '1rem' }} />
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              margin: '0 0 0.5rem 0'
            }}>
              Welcome Back
            </h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Sign in to your account
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
                  <Lock size={16} style={{ marginRight: '0.5rem' }} />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#3b82f6', 
                    fontSize: '0.875rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#64748b', margin: 0 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;