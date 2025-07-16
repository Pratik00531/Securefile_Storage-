import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import Scene3D from '../components/3D/Scene3D';
import HolographicCard from '../components/3D/HolographicCard';
import HolographicInput from '../components/3D/HolographicInput';
import NeonButton from '../components/3D/NeonButton';

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
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <UserPlus 
                  size={64} 
                  style={{ 
                    color: '#ff00ff', 
                    marginBottom: '20px',
                    filter: 'drop-shadow(0 0 20px #ff00ff)'
                  }} 
                />
              </motion.div>
              <h1 className="glow-text" style={{ 
                fontSize: '2rem', 
                marginBottom: '10px',
                color: '#ff00ff'
              }}>
                Create Vault
              </h1>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.7)', 
                fontSize: '1.1rem' 
              }}>
                Join the secure network
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
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                icon={User}
                required
              />

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
                placeholder="Create a password"
                icon={Lock}
                required
              />

              <HolographicInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                icon={Lock}
                required
              />

              <NeonButton
                type="submit"
                variant="secondary"
                disabled={loading}
                loading={loading}
                style={{ width: '100%', marginBottom: '20px' }}
              >
                {loading ? 'Creating Vault...' : 'Initialize Vault'}
              </NeonButton>
            </form>

            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Already have access? {' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#ff00ff', 
                    textDecoration: 'none',
                    textShadow: '0 0 5px rgba(255, 0, 255, 0.5)'
                  }}
                >
                  Enter Vault
                </Link>
              </p>
              </div>
            </div>
          </HolographicCard>
        </motion.div>
      </div>
    </Scene3D>
  );
};

export default Register;