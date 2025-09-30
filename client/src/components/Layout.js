import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Users, Calendar, User } from 'lucide-react';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen">{children}</div>;
  }

  const isActive = (path) => location.pathname === path;

  const handleUserClick = () => {
    navigate('/profile');
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/dashboard" className="header-logo">
              <div className="logo-icon">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="logo-text">
                <h1>MSAConnect</h1>
                <p>UCSD Muslim Student Association</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="header-nav">
              <Link
                to="/dashboard"
                className={`nav-button ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <Calendar className="w-4 h-4" />
                My Classes
              </Link>
            </nav>

            {/* User section */}
            <div className="user-section">
              <div className="user-info" onClick={handleUserClick}>
                <p className="user-name">{user?.name}</p>
                <p className="user-details">{user?.major} • {user?.year}</p>
              </div>
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-container">
          <div className="mobile-nav-content">
            <Link
              to="/dashboard"
              className={`mobile-nav-button ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <Calendar className="w-4 h-4" />
              Classes
            </Link>
            <Link
              to="/profile"
              className={`mobile-nav-button ${isActive('/profile') ? 'active' : ''}`}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
