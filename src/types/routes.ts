import type { ComponentType } from 'react';
import type { TenantConfig } from './tenant';
import type { User } from './auth';

export interface RouteConfig {
  path: string;
  component: ComponentType<Record<string, unknown>>;
  exact?: boolean;
  requiresAuth?: boolean;
  requiresFeature?: string;
  title?: string;
  roles?: string[];
  meta?: {
    description?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
}

export interface RouteGuard {
  canActivate: (tenant: TenantConfig, user: User | null) => boolean;
  redirectTo?: string;
  message?: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
  requiresFeature?: string;
  requiresAuth?: boolean;
  roles?: string[];
}

export type RouteParams = Record<string, string>;
export type QueryParams = Record<string, string>;
