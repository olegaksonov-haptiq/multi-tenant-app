import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/auth/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [], permissions = [], fallback }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check roles
  if (roles.length > 0 && !roles.some((role) => user.roles.includes(role))) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  // Check permissions
  if (permissions.length > 0 && !permissions.some((permission) => user.permissions.includes(permission))) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
