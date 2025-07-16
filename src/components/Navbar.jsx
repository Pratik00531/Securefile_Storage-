import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Shield className="me-2" size={24} />
          Secure File Storage
        </Link>
        
        <div className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <>
              <span className="navbar-text me-3">
                <User size={16} className="me-1" />
                {user.username}
              </span>
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                <LogOut size={16} className="me-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;