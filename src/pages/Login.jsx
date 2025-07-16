import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { LogIn, Mail, Lock } from 'lucide-react';
import Scene3D from '../components/3D/Scene3D';
import HolographicCard from '../components/3D/HolographicCard';
import HolographicInput from '../components/3D/HolographicInput';
import NeonButton from '../components/3D/NeonButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  return (
    <Scene3D>
      <div className="container-3d" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <HolographicCard className="form-container">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <LogIn 
                  size={64} 
                  style={{ 
                    color: '#00ffff', 
                    marginBottom: '20px',
                    filter: 'drop-shadow(0 0 20px #00ffff)'
                  }} 
                />
              </motion.div>
              <h1 className="glow-text" style={{ 
                fontSize: '2rem', 
                marginBottom: '10px',
                color: '#00ffff'
              }}>
                Welcome Back
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '1.1rem' 
              }}>
                Access your secure vault
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="alert-3d"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <HolographicInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={Mail}
                required
              />

              <HolographicInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={Lock}
                required
              />

              <NeonButton
                type="submit"
                variant="primary"
                disabled={loading}
                loading={loading}
                style={{ width: '100%', marginBottom: '20px' }}
              >
                {loading ? 'Accessing Vault...' : 'Enter Vault'}
              </NeonButton>
            </form>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Need access? {' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#00ffff', 
                    textDecoration: 'none',
                    textShadow: '0 0 5px rgba(0, 255, 255, 0.5)'
                  }}
                >
                  Create Account
                </Link>
              </p>
            </div>
          </HolographicCard>
        </motion.div>
      </div>
    </Scene3D>
  );
};

export default Login;