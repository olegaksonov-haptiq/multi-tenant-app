import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../index';

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthUser = createSelector(selectAuthState, (state) => state.user);
export const selectAuthToken = createSelector(selectAuthState, (state) => state.token);
export const selectAuthIsAuthenticated = createSelector(selectAuthState, (state) => state.isAuthenticated);
export const selectAuthIsLoading = createSelector(selectAuthState, (state) => state.isLoading);
export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
