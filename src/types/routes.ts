import type { ComponentType } from 'react';

export interface RouteConfig {
  path: string;
  component: ComponentType<Record<string, unknown>>;
  exact?: boolean;
  requiresAuth?: boolean;
  requiresFeature?: string;
  requiresPermissions?: string[];
  title?: string;
  roles?: string[];
  allowTenantMismatch?: boolean;
  meta?: {
    description?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  requiresFeature?: string;
  requiresAuth?: boolean;
  roles?: string[];
  requiresPermissions?: string[];
}

export type RouteParams = Record<string, string>;
export type QueryParams = Record<string, string>;
