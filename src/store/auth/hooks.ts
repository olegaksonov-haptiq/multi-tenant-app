import { useCallback, useMemo } from 'react';

import type { AuthContextType, LoginCredentials } from '../../types/auth';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectTenant } from '../tenant/selectors';
import { login, logout } from './authSlice';
import { selectAuthState } from './selectors';

export const useAuth = (): AuthContextType => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuthState);
  const tenant = useAppSelector(selectTenant);

  const loginUser = useCallback(
    async (credentials: LoginCredentials) => {
      await dispatch(login(credentials)).unwrap();
    },
    [dispatch],
  );

  const logoutUser = useCallback(async () => {
    await dispatch(logout()).unwrap();
  }, [dispatch]);

  const hasRole = useCallback((role: string) => authState.user?.roles.includes(role) ?? false, [authState.user]);

  const hasPermission = useCallback(
    (permission: string) => authState.user?.permissions.includes(permission) ?? false,
    [authState.user],
  );

  const hasFeature = useCallback(
    (feature: string) => {
      if (!tenant) return false;

      return tenant.features?.[feature as keyof typeof tenant.features] ?? false;
    },
    [tenant],
  );

  return useMemo(
    () => ({
      authState,
      user: authState.user,
      token: authState.token,
      isAuthenticated: authState.isAuthenticated,
      isInitializing: authState.isInitializing,
      isLoading: authState.isLoading,
      error: authState.error,
      login: loginUser,
      logout: logoutUser,
      hasRole,
      hasPermission,
      hasFeature,
    }),
    [authState, loginUser, logoutUser, hasRole, hasPermission, hasFeature],
  );
};
