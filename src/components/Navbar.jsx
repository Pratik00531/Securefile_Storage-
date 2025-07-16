import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, LogOut, User, Settings, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <Shield size={24} />
          SecureVault
        </Link>
        
        {isAuthenticated ? (
          <ul className="navbar-nav">
            <li>
              <Link 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} 
                to="/dashboard"
              >
                <BarChart3 size={18} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`} 
                to="/profile"
              >
                <User size={18} />
                Profile
              </Link>
            </li>
            <li>
              <Link 
                className={`nav-link ${isActive('/settings') ? 'active' : ''}`} 
                to="/settings"
              >
                <Settings size={18} />
                Settings
              </Link>
            </li>
            <li>
              <button className="btn btn-outline" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul className="navbar-nav">
            <li>
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="btn btn-primary" to="/register">
                Sign Up
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;