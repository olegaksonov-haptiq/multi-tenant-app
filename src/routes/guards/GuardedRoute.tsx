import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../store/auth/hooks';
import { useTenant } from '../../store/tenant/hooks';
import type { RouteConfig } from '../../types/routes';
import type { GuardContext, GuardPolicy } from '../../types/guards';

const authPolicy: GuardPolicy = ({ route, isAuthenticated, location }) => {
  if (!route.requiresAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return {
      type: 'redirect',
      to: '/login',
      replace: true,
      state: { from: location },
    };
  }

  return null;
};

const tenantPolicy: GuardPolicy = ({ route, tenant, user, location }) => {
  if (!route.requiresAuth || route.allowTenantMismatch) {
    return null;
  }

  if (user && tenant && user.tenantId !== tenant.id) {
    return {
      type: 'redirect',
      to: '/login',
      replace: true,
      state: { from: location },
    };
  }

  return null;
};

const rolesPolicy: GuardPolicy = ({ route, user, fallback }) => {
  if (!route.roles || route.roles.length === 0) {
    return null;
  }

  if (!user || !route.roles.some((role) => user.roles.includes(role))) {
    if (fallback) {
      return { type: 'render', element: fallback };
    }

    return { type: 'redirect', to: '/unauthorized', replace: true };
  }

  return null;
};

const permissionsPolicy: GuardPolicy = ({ route, user, fallback }) => {
  if (!route.requiresPermissions || route.requiresPermissions.length === 0) {
    return null;
  }

  if (!user || !route.requiresPermissions.some((permission) => user.permissions.includes(permission))) {
    if (fallback) {
      return { type: 'render', element: fallback };
    }

    return { type: 'redirect', to: '/unauthorized', replace: true };
  }

  return null;
};

const featurePolicy: GuardPolicy = ({ route, tenant, fallback }) => {
  if (!route.requiresFeature) {
    return null;
  }

  if (!tenant) {
    return { type: 'redirect', to: '/feature-unavailable', replace: true };
  }

  const hasFeature = Boolean(tenant.features?.[route.requiresFeature as keyof typeof tenant.features]);

  if (!hasFeature) {
    if (fallback) {
      return { type: 'render', element: fallback };
    }

    return { type: 'redirect', to: '/feature-unavailable', replace: true };
  }

  return null;
};

const defaultPolicies: GuardPolicy[] = [authPolicy, tenantPolicy, rolesPolicy, permissionsPolicy, featurePolicy];

interface GuardedRouteProps {
  route: RouteConfig;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  policies?: GuardPolicy[];
}

export const GuardedRoute: React.FC<GuardedRouteProps> = ({ route, children, fallback, policies }) => {
  const location = useLocation();
  const { tenant } = useTenant();
  const { user, isAuthenticated } = useAuth();

  const context: GuardContext = {
    route,
    tenant,
    user,
    isAuthenticated,
    location,
    fallback,
  };

  const combinedPolicies = [...defaultPolicies, ...(policies ?? [])];

  for (const policy of combinedPolicies) {
    const result = policy(context);
    if (!result) continue;

    if (result.type === 'render') {
      return <>{result.element}</>;
    }

    return <Navigate to={result.to} replace={result.replace ?? true} state={result.state} />;
  }

  return <>{children}</>;
};

export type { GuardPolicy } from '../../types/guards';

export default GuardedRoute;
