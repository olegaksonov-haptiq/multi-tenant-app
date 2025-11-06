import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTenant } from '../../store/tenant/hooks';
import { useAuth } from '../../store/auth/hooks';
import { navigationConfig } from '../../routes/routes';
import '../../styles/theme.scss';

interface NavbarProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, showMenuButton }) => {
  const { tenant } = useTenant();
  const { user, logout, hasFeature } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    void logout();
    navigate('/login');
  };

  const filteredNavItems = navigationConfig.filter((item) => {
    if (item.requiresAuth && !user) return false;
    if (item.requiresFeature && !hasFeature(item.requiresFeature)) return false;
    if (item.roles && item.roles.length > 0) {
      if (!user) return false;
      return item.roles.some((role) => user.roles.includes(role));
    }
    if (item.requiresPermissions && item.requiresPermissions.length > 0) {
      if (!user) return false;
      return item.requiresPermissions.some((permission) => user.permissions.includes(permission));
    }
    return true;
  });

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showMenuButton && (
          <button className="menu-toggle" onClick={onMenuClick}>
            ☰
          </button>
        )}
        <Link to="/dashboard" className="navbar-brand">
          {tenant?.branding?.logo && <img src={tenant.branding.logo} alt="logo" className="navbar-logo" />}
          <span className="navbar-title">{tenant?.displayName}</span>
        </Link>
      </div>

      <div className="navbar-center">
        <div className="navbar-links">
          {filteredNavItems.map((item) => (
            <Link key={item.path} to={item.path} className="navbar-link">
              {item.icon && <span className="nav-icon">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="user-menu">
            <button className="user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
              <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
              <span className="user-name">{user.name}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <div className="user-email">{user.email}</div>
                  <div className="user-roles">{user.roles.join(', ')}</div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  Settings
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};
