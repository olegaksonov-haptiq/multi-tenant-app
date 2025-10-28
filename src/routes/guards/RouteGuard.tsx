import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTenant } from '../../utils/tenant/tenantContext';
import { useAuth } from '../../hooks/useAuth';
import type { RouteConfig } from '../../types/routes';

interface RouteGuardProps {
  children: React.ReactNode;
  route: RouteConfig;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, route }) => {
  const { tenant } = useTenant();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Skip guards for error pages
  if (route.requiresAuth === false) {
    return <>{children}</>;
  }

  // Redirect if authenticated user is associated with a different tenant context
  if (user && tenant && user.tenantId !== tenant.id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires authentication
  if (route.requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles
  if (route.roles && route.roles.length > 0) {
    if (!user || !route.roles.some((role) => user.roles.includes(role))) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if route requires specific feature
  if (route.requiresFeature && tenant) {
    const hasFeature = tenant.features?.[route.requiresFeature as keyof typeof tenant.features];
    if (!hasFeature) {
      return <Navigate to="/feature-unavailable" replace />;
    }
  }

  return <>{children}</>;
};

export default RouteGuard;
