export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  tenantId: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  tenantId?: string;
}

export interface AuthContextType {
  authState: AuthState;
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasFeature: (feature: string) => boolean;
}
