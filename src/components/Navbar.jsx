import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Shield, LogOut, User } from 'lucide-react';
import NeonButton from './3D/NeonButton';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      className="futuristic-nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 255, 255, 0.3)'
      }}
    >
      <div className="container-3d" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px 20px'
      }}>
        <Link 
          className="nav-brand" 
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#00ffff',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
          }}
        >
          <Shield 
            size={32} 
            style={{ 
              marginRight: '10px',
              filter: 'drop-shadow(0 0 10px #00ffff)'
            }} 
          />
          SECURE VAULT
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isAuthenticated ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1rem'
                }}
              >
                <User 
                  size={20} 
                  style={{ 
                    marginRight: '8px', 
                    color: '#ff00ff',
                    filter: 'drop-shadow(0 0 5px #ff00ff)'
                  }} 
                />
                <span style={{ textShadow: '0 0 5px rgba(255, 255, 255, 0.5)' }}>
                  {user.username}
                </span>
              </motion.div>
              <NeonButton
                variant="danger"
                onClick={handleLogout}
                style={{ fontSize: '14px', padding: '8px 16px' }}
              >
                <LogOut size={16} style={{ marginRight: '5px' }} />
                Exit
              </NeonButton>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link 
                to="/login"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#00ffff';
                  e.target.style.textShadow = '0 0 5px rgba(0, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.textShadow = 'none';
                }}
              >
                Access Vault
              </Link>
              <Link 
                to="/register"
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ff00ff';
                  e.target.style.textShadow = '0 0 5px rgba(255, 0, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.textShadow = 'none';
                }}
              >
                Create Vault
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;