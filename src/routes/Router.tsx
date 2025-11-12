import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes, defaultRoutes } from './routes';
import GuardedRoute from './guards/GuardedRoute';
import { useAuth } from '../store/auth/hooks';
import { useTenant } from '../store/tenant/hooks';

const Router: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const { loading: tenantLoading } = useTenant();

  // Show loading while checking auth and tenant
  if (isInitializing || tenantLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Default redirects */}
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? defaultRoutes.authenticated : defaultRoutes.unauthenticated} replace />
        }
      />

      {/* Configured routes */}
      {routes.map((route) => {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <GuardedRoute route={route}>
                <route.component />
              </GuardedRoute>
            }
          />
        );
      })}

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to={defaultRoutes.notFound} replace />} />
    </Routes>
  );
};

export default Router;
