import React, { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { AuthState, LoginCredentials, AuthContextType } from '../types/auth';
import { useTenant } from '../utils/tenant/tenantContext';

import { sessionStorage } from '../utils/auth/sessionStorage';
import { mockAuthApi } from '../utils/auth/mockAuthApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const { tenant } = useTenant();

  useEffect(() => {
    const initializeAuth = async () => {
      const user = sessionStorage.getUser();
      const { token } = user ?? {};

      if (!token) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const { user: validatedUser, token: validatedToken } = await mockAuthApi.validate(token);
        setAuthState({
          user: validatedUser,
          token: validatedToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        sessionStorage.clearToken();
        console.warn('Token validation failed', error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    void initializeAuth();
  }, []);

  // useEffect(() => {
  //   // React to tenant changes by logging out if tenant mismatch
  //   if (!authState.user) return;

  //   if (tenant && authState.user.tenantId !== tenant.id) {
  //     console.log('tenant mismatch', tenant, authState.user);
  //     sessionStorage.clearToken();
  //     void logout();
  //   }
  // }, [tenant, authState.user]);

  const login = async (credentials: LoginCredentials) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const tenantId = tenant?.id;
      const { user, token } = await mockAuthApi.login({ ...credentials, tenantId });

      sessionStorage.setToken(token, tenantId ?? '');

      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    sessionStorage.clearToken();

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const hasRole = (role: string): boolean => {
    return authState.user?.roles.includes(role) ?? false;
  };

  const hasPermission = (permission: string): boolean => {
    return authState.user?.permissions.includes(permission) ?? false;
  };

  const hasFeature = (feature: string): boolean => {
    if (!tenant) return false;
    return tenant.features?.[feature as keyof typeof tenant.features] ?? false;
  };

  const value: AuthContextType = {
    authState,
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    login,
    logout,
    hasRole,
    hasPermission,
    hasFeature,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
