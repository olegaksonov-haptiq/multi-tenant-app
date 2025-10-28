import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { routes, defaultRoutes } from './routes';
import RouteGuard from './guards/RouteGuard';
import { useAuth } from '../hooks/useAuth';
import { useTenant } from '../utils/tenant/tenantContext';

const Router: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { loading: tenantLoading } = useTenant();

  // Show loading while checking auth and tenant
  if (isLoading || tenantLoading) {
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
              <RouteGuard route={route}>
                <route.component />
              </RouteGuard>
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
