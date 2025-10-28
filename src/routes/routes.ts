import type { RouteConfig } from '../types/routes';
import Dashboard from '../pages/Dashboard';
import Reports from '../pages/Reports';
import Login from '../pages/Login';
import { NotFound, Unauthorized, FeatureUnavailable } from '../pages/ErrorPages';

export const routes: RouteConfig[] = [
  // Public routes
  {
    path: '/login',
    component: Login,
    exact: true,
    title: 'Sign In',
    meta: {
      description: 'Sign in to your account',
      noIndex: true,
    },
  },

  // Protected routes
  {
    path: '/dashboard',
    component: Dashboard,
    exact: true,
    requiresAuth: true,
    title: 'Dashboard',
    meta: {
      description: 'Your dashboard overview',
    },
  },
  {
    path: '/reports',
    component: Reports,
    exact: true,
    requiresAuth: true,
    requiresFeature: 'advancedReports',
    title: 'Reports',
    roles: ['user', 'admin'],
    meta: {
      description: 'View reports and analytics',
    },
  },

  // Error pages (no auth required)
  {
    path: '/404',
    component: NotFound,
    exact: true,
    requiresAuth: false,
    title: 'Page Not Found',
    meta: {
      description: 'Page not found',
      noIndex: true,
    },
  },
  {
    path: '/unauthorized',
    component: Unauthorized,
    exact: true,
    requiresAuth: false,
    title: 'Access Denied',
    meta: {
      description: 'Access denied',
      noIndex: true,
    },
  },
  {
    path: '/feature-unavailable',
    component: FeatureUnavailable,
    exact: true,
    requiresAuth: false,
    title: 'Feature Unavailable',
    meta: {
      description: 'Feature not available',
      noIndex: true,
    },
  },
];

// Navigation configuration
export const navigationConfig = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '🏠',
    requiresAuth: true,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: '📊',
    requiresAuth: true,
    requiresFeature: 'advancedReports',
    roles: ['user', 'admin'],
  },
];

// Default redirects
export const defaultRoutes = {
  authenticated: '/dashboard',
  unauthenticated: '/login',
  notFound: '/404',
};
