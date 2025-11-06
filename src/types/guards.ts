import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';

import type { RouteConfig } from './routes';
import type { TenantConfig } from './tenant';
import type { User } from './auth';

export interface GuardContext {
  route: RouteConfig;
  tenant?: TenantConfig;
  user: User | null;
  isAuthenticated: boolean;
  location: Location;
  fallback?: ReactNode;
}

export type GuardFailure =
  | { type: 'redirect'; to: string; replace?: boolean; state?: Record<string, unknown> }
  | { type: 'render'; element: ReactNode };

export type GuardPolicy = (context: GuardContext) => GuardFailure | null;
